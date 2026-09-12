/**
 * Seed script — reference data the app cannot function without.
 *
 * Run with `npm run db:seed`. Every insert uses `onConflictDoNothing()`, so the
 * script is idempotent: running it twice is a no-op rather than a duplicate-key
 * crash. That matters because it runs on every developer's machine and against
 * every fresh environment.
 *
 * Reference data (brands, tiers) belongs here. User data does not — profiles
 * are created from real sign-ups by `ensureProfile` in `src/auth/profile.ts`.
 * The optional `SEED_ADMIN_*` path below only *links* an existing profile to
 * `brand_admins`; it never invents a fake user UUID that cannot sign in.
 */

// Must come first. `./client` reads `process.env.DATABASE_URL` at import time
// and throws without it. Next.js loads `.env` automatically; a standalone tsx
// script does not, so dotenv has to run before anything imports the client.
import "dotenv/config";

import { eq, sql } from "drizzle-orm";

import { closeDb, db } from "./client";
import { brandAdmins } from "./schema/brand-admins";
import { brands } from "./schema/brands";
import { membershipTiers } from "./schema/membership-tiers";
import { profiles } from "./schema/profiles";

interface SeedBrand {
  id: string;
  name: string;
  theme: string;
  primaryHost: string;
}

interface SeedTier {
  slug: string;
  name: string;
  rank: number;
}

/**
 * Both product brands. IDs match `resolveBrand` / DaisyUI theme names.
 * `primaryHost` is the production host; local routing still goes through
 * `BRAND_HOST_MAP` (see docs/onboarding.md).
 */
const SEED_BRANDS: SeedBrand[] = [
  {
    id: "agentlabs",
    name: "The Agent Labs",
    theme: "agentlabs",
    primaryHost: "theagentlabs.ai",
  },
  {
    id: "timerich",
    name: "Time Rich",
    theme: "timerich",
    primaryHost: "timerich.ai",
  },
];

/**
 * The three student tiers, in rank order. Slugs are identical per brand;
 * uniqueness is `(brand_id, slug)` on the table. Tier `id`s are brand-prefixed
 * so each row has a stable text primary key without colliding across brands.
 */
const TIER_DEFS: SeedTier[] = [
  { slug: "essentials", name: "Essentials", rank: 1 },
  { slug: "edit", name: "Edit", rank: 2 },
  { slug: "studio", name: "Studio", rank: 3 },
];

const tiersForBrand = (brandId: string) =>
  TIER_DEFS.map((tier) => ({
    id: `${brandId}-${tier.slug}`,
    brandId,
    slug: tier.slug,
    name: tier.name,
    rank: tier.rank,
  }));

/**
 * Resolve which existing profile to promote into `brand_admins`.
 *
 * Prefers `SEED_ADMIN_USER_ID` (the Supabase Auth / `profiles.id` UUID). Falls
 * back to `SEED_ADMIN_EMAIL`, which looks up `auth.users` and uses that id —
 * profiles do not store email, so the auth schema is the only place to resolve
 * it. Returns null when neither env var is set (brands/tiers still seed).
 */
const resolveAdminProfileId = async (): Promise<string | null> => {
  const userId = process.env.SEED_ADMIN_USER_ID?.trim();
  if (userId) {
    return userId;
  }

  const email = process.env.SEED_ADMIN_EMAIL?.trim();
  if (!email) {
    return null;
  }

  // auth.users is owned by Supabase Auth; it is not in our Drizzle schema.
  // A one-off SQL lookup is enough for local seeding and keeps profiles free
  // of email columns that would duplicate Auth.
  const rows = await db.execute<{ id: string }>(
    sql`select id from auth.users where lower(email) = lower(${email}) limit 1`,
  );

  const id = rows[0]?.id;
  if (!id) {
    throw new Error(
      `SEED_ADMIN_EMAIL=${email} did not match any auth.users row. Sign up locally first, then re-run npm run db:seed.`,
    );
  }

  return id;
};

const seedBrandAdmins = async (profileId: string): Promise<void> => {
  const [existing] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.id, profileId))
    .limit(1);

  if (!existing) {
    throw new Error(
      `No profiles row for ${profileId}. Sign in once so ensureProfile creates it, then re-run npm run db:seed.`,
    );
  }

  // Default: admin on every seeded brand so both portals are testable.
  // Override with a comma list, e.g. SEED_ADMIN_BRAND_IDS=agentlabs
  const fromEnv = process.env.SEED_ADMIN_BRAND_IDS?.split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const brandIds =
    fromEnv && fromEnv.length > 0
      ? fromEnv
      : SEED_BRANDS.map((brand) => brand.id);

  await db
    .insert(brandAdmins)
    .values(brandIds.map((brandId) => ({ profileId, brandId })))
    .onConflictDoNothing();

  console.log(
    `Ensured brand_admins for profile ${profileId} on: ${brandIds.join(", ")}.`,
  );
};

const seed = async (): Promise<void> => {
  // `membership_tiers.brand_id` and `brand_admins.brand_id` both FK onto
  // `brands.id`, so brands land first.
  await db.insert(brands).values(SEED_BRANDS).onConflictDoNothing();

  const allTiers = SEED_BRANDS.flatMap((brand) => tiersForBrand(brand.id));

  await db.insert(membershipTiers).values(allTiers).onConflictDoNothing();

  // "Ensured", not "Inserted" — on a second run every insert is skipped and
  // nothing is written. A script should not claim work it did not do.
  console.log(
    `Ensured ${SEED_BRANDS.length} brands and ${allTiers.length} membership tiers.`,
  );

  const adminProfileId = await resolveAdminProfileId();
  if (adminProfileId) {
    await seedBrandAdmins(adminProfileId);
  } else {
    console.log(
      "Skipped brand_admins (set SEED_ADMIN_USER_ID or SEED_ADMIN_EMAIL to promote a local user).",
    );
  }
};

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  // `postgres` holds an open socket, which keeps Node alive. Without this the
  // script prints its output and then hangs instead of exiting.
  .finally(closeDb);
