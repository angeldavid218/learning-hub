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
 */

// Must come first. `./client` reads `process.env.DATABASE_URL` at import time
// and throws without it. Next.js loads `.env` automatically; a standalone tsx
// script does not, so dotenv has to run before anything imports the client.
import "dotenv/config";

import { closeDb, db } from "./client";
import { brands } from "./schema/brands";
import { membershipTiers } from "./schema/membership-tiers";

const AGENT_LABS_BRAND_ID = "agentlabs";

/**
 * The three Agent Labs tiers, in rank order.
 *
 * IDs are supplied by hand because `membership_tiers.id` is a text primary key
 * with no default. They are brand-prefixed so `timerich` can have its own
 * `essentials` tier later without colliding on the primary key.
 */
const AGENT_LABS_TIERS = [
  { id: "agentlabs-essentials", slug: "essentials", name: "Essentials", rank: 1 },
  { id: "agentlabs-edit", slug: "edit", name: "Edit", rank: 2 },
  { id: "agentlabs-studio", slug: "studio", name: "Studio", rank: 3 },
];

const seed = async (): Promise<void> => {
  // `membership_tiers.brand_id` is a foreign key onto `brands.id`, so the brand
  // row has to exist before any tier can be inserted. The brands table has
  // never been seeded, so this script owns that prerequisite.
  await db
    .insert(brands)
    .values({
      id: AGENT_LABS_BRAND_ID,
      name: "The Agent Labs",
      theme: "agentlabs",
      primaryHost: "theagentlabs.ai",
    })
    .onConflictDoNothing();

  // One INSERT with three rows: a single round trip, and the tier data stays in
  // one readable block above. `brandId` is applied here rather than repeated on
  // each row because it describes the whole batch, not the individual tiers.
  await db
    .insert(membershipTiers)
    .values(
      AGENT_LABS_TIERS.map((tier) => ({
        ...tier,
        brandId: AGENT_LABS_BRAND_ID,
      })),
    )
    .onConflictDoNothing();

  // "Ensured", not "Inserted" — on a second run every insert is skipped and
  // nothing is written. A script should not claim work it did not do.
  console.log(
    `Ensured ${AGENT_LABS_TIERS.length} Agent Labs membership tiers exist.`,
  );
};

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  // `postgres` holds an open socket, which keeps Node alive. Without this the
  // script prints its output and then hangs instead of exiting.
  .finally(closeDb);
