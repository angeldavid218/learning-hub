"use server";

import { redirect } from "next/navigation";

import { ensureProfile } from "./profile";
import { getRequestOrigin } from "./request";
import { createServerSupabaseClient } from "./supabase-server";
import { safeNextPath } from "./utils";

export interface AuthFormState {
  error?: string;
  message?: string;
}

const AUTH_CALLBACK_PATH = "/auth/confirm";

const readString = (formData: FormData, field: string): string => {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
};

export const signIn = async (
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const email = readString(formData, "email");
  const password = readString(formData, "password");
  const next = safeNextPath(readString(formData, "next"));

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Deliberately not echoing Supabase's message: it distinguishes "user not
    // found" from "wrong password", which enumerates accounts.
    return { error: "That email and password do not match." };
  }

  await ensureProfile(data.user);

  // redirect() signals by throwing, so it must stay out of any try/catch.
  redirect(next);
};

export const signUp = async (
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const email = readString(formData, "email");
  const password = readString(formData, "password");
  const displayName = readString(formData, "displayName");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createServerSupabaseClient();
  const origin = await getRequestOrigin();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName || null },
      emailRedirectTo: `${origin}${AUTH_CALLBACK_PATH}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // The profile row is written in the callback route: until the address is
  // confirmed there is no session to attribute it to.
  return { message: "Check your email to confirm your account." };
};

export const requestPasswordReset = async (
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const email = readString(formData, "email");

  if (!email) {
    return { error: "Enter your email address." };
  }

  const supabase = await createServerSupabaseClient();
  const origin = await getRequestOrigin();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}${AUTH_CALLBACK_PATH}?next=/reset-password`,
  });

  // Always the same answer, whether or not the address exists — otherwise this
  // form becomes a way to test which emails have accounts.
  return {
    message: "If that address has an account, a reset link is on its way.",
  };
};

export const updatePassword = async (
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const password = readString(formData, "password");
  const confirmPassword = readString(formData, "confirmPassword");

  if (password.length < 8) {
    return { error: "Use at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Those passwords do not match." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
};

export const signOut = async (): Promise<void> => {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
};
