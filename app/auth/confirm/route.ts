import { type EmailOtpType, type User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { ensureProfile } from "@/src/auth/profile";
import { createServerSupabaseClient } from "@/src/auth/supabase-server";
import { safeNextPath } from "@/src/auth/utils";

/**
 * Landing point for Supabase email links — confirmation and password reset.
 *
 * Handles both link styles: `token_hash` + `type` (email OTP) and `code`
 * (PKCE), since which one arrives depends on the project's email templates.
 */
export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  const supabase = await createServerSupabaseClient();

  let user: User | null = null;

  if (tokenHash && type) {
    const { data } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    user = data?.user ?? null;
  } else if (code) {
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    user = data?.user ?? null;
  }

  if (!user) {
    return NextResponse.redirect(
      new URL("/login?error=link_invalid", request.url),
    );
  }

  await ensureProfile(user);

  const next = safeNextPath(searchParams.get("next"));
  return NextResponse.redirect(new URL(next, request.url));
};
