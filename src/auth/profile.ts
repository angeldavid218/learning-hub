import "server-only";

import { type User } from "@supabase/supabase-js";

import { db, profiles } from "@/src/db";

/**
 * `display_name` is user-controlled metadata, so it is narrowed rather than
 * cast. It is a display string only and is never used for authorization.
 */
const readDisplayName = (user: User): string | null =>
  typeof user.user_metadata?.display_name === "string"
    ? user.user_metadata.display_name
    : null;

/**
 * Guarantee a `profiles` row for an authenticated user.
 *
 * `profiles.id` is a foreign key onto `auth.users.id`, so the row can only be
 * written once Supabase has actually created the user. Idempotent: safe to call
 * on every sign-in and on email confirmation, whichever happens first.
 */
export const ensureProfile = async (user: User): Promise<void> => {
  await db
    .insert(profiles)
    .values({ id: user.id, displayName: readDisplayName(user) })
    .onConflictDoNothing();
};
