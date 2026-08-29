interface SupabaseEnv {
  url: string;
  publishableKey: string;
}

/**
 * Supabase renamed the `anon` key to the "publishable" key. Both names are
 * accepted so a key copied from an older dashboard still works.
 *
 * These reads must stay as static `process.env.X` member access — that is what
 * Next.js inlines into the client bundle.
 */
export const getSupabaseEnv = (): SupabaseEnv => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }

  if (!publishableKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) is not set",
    );
  }

  return { url, publishableKey };
};
