import "server-only";

import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

import { brandAdmins, db } from "@/src/db";

import { getRequestPathname } from "./request";
import { createServerSupabaseClient } from "./supabase-server";

export interface SessionUser {
  id: string;
  email: string | null;
}

/**
 * The verified signed-in user, or null.
 *
 * Uses `getClaims()`, which verifies the access token's signature rather than
 * trusting the cookie. Never swap this for `getSession()` — that reads the
 * cookie without revalidating it, so a forged cookie would pass.
 *
 * Memoized per render pass, so a layout and its pages share one verification.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    return null;
  }

  return { id: data.claims.sub, email: data.claims.email ?? null };
});

/** Signed-in user, or a redirect to login that returns here afterwards. */
export const requireUser = async (): Promise<SessionUser> => {
  const user = await getSessionUser();

  if (user) {
    return user;
  }

  const pathname = await getRequestPathname();
  redirect(
    pathname ? `/login?next=${encodeURIComponent(pathname)}` : "/login",
  );
};

/**
 * Whether the user administers this brand.
 *
 * `brandId` is a parameter rather than something resolved in here: the brand
 * comes from the Host header via `resolveBrand`, which is not built yet. Callers
 * pass the server-resolved brand — never a client-supplied one.
 */
export const isBrandAdmin = cache(
  async (profileId: string, brandId: string): Promise<boolean> => {
    const rows = await db
      .select({ brandId: brandAdmins.brandId })
      .from(brandAdmins)
      .where(
        and(
          eq(brandAdmins.profileId, profileId),
          eq(brandAdmins.brandId, brandId),
        ),
      )
      .limit(1);

    return rows.length > 0;
  },
);

/**
 * Signed-in user who administers `brandId`.
 *
 * A signed-in non-admin gets a 404 rather than a redirect to login, which would
 * loop them through a form they have already completed. 404 over 403 also keeps
 * the admin surface unadvertised to students.
 */
export const requireBrandAdmin = async (
  brandId: string,
): Promise<SessionUser> => {
  const user = await requireUser();

  if (!(await isBrandAdmin(user.id, brandId))) {
    notFound();
  }

  return user;
};
