import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseEnv } from "./config";

/**
 * Supabase client bound to the current request's cookies.
 *
 * Create one per request — never hoist it to a module-level singleton, or one
 * user's session leaks into another user's request.
 */
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabaseEnv();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. proxy.ts refreshes the
          // session on every matched request, so the refreshed token is still
          // persisted there and this branch is safe to swallow.
        }
      },
    },
  });
};
