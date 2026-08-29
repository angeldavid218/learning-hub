import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnv } from "@/src/auth/config";
import { PATHNAME_HEADER } from "@/src/auth/headers";

/**
 * Refreshes the Supabase session on every page request.
 *
 * Server Components cannot write cookies, so a token that expires mid-render
 * has nowhere to be persisted. This runs first and writes the refreshed cookie
 * onto the response.
 *
 * This is deliberately *not* where routes are protected. Next.js routes Server
 * Functions as POSTs to the page they live on, so a matcher change can silently
 * drop coverage. Authorization belongs in src/auth/session.ts, next to the data.
 */
export const proxy = async (request: NextRequest) => {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(PATHNAME_HEADER, request.nextUrl.pathname);

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  let env: ReturnType<typeof getSupabaseEnv>;
  try {
    env = getSupabaseEnv();
  } catch {
    // No Supabase credentials configured yet. Pass the request through rather
    // than 500-ing every route: the session helpers still fail closed, so an
    // unconfigured deploy cannot serve authenticated content.
    return response;
  }

  const supabase = createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request: { headers: requestHeaders } });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });

        // These are no-store/no-cache headers. Without them a CDN can cache a
        // response carrying one user's Set-Cookie and serve that session to
        // somebody else.
        Object.entries(headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      },
    },
  });

  // Must be awaited before the response is returned — a refresh that lands
  // after the response is committed cannot write its cookie.
  await supabase.auth.getClaims();

  return response;
};

export const config = {
  matcher: [
    /*
     * Every path except static assets and image optimization, which never
     * carry a session and would only burn a refresh check.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
