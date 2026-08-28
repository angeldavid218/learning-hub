"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signIn, type AuthFormState } from "@/src/auth/actions";

import { AuthFeedback } from "../_components/auth-feedback";
import { SubmitButton } from "../_components/submit-button";

interface LoginFormProps {
  next: string;
  initialError?: string;
}

const EMPTY_STATE: AuthFormState = {};

export const LoginForm = ({ next, initialError }: LoginFormProps) => {
  const [state, formAction] = useActionState(
    signIn,
    initialError ? { error: initialError } : EMPTY_STATE,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <AuthFeedback state={state} />

      <input type="hidden" name="next" value={next} />

      <label className="form-control w-full">
        <span className="label-text mb-1 block">Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          className="input input-bordered w-full"
        />
      </label>

      <label className="form-control w-full">
        <span className="label-text mb-1 block">Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          className="input input-bordered w-full"
        />
      </label>

      <SubmitButton label="Sign in" pendingLabel="Signing in…" />

      <Link href="/forgot-password" className="link link-hover text-sm">
        Forgot your password?
      </Link>
    </form>
  );
};
