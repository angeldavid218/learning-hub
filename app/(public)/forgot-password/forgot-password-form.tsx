"use client";

import Link from "next/link";
import { useActionState } from "react";

import { requestPasswordReset, type AuthFormState } from "@/src/auth/actions";

import { AuthFeedback } from "../_components/auth-feedback";
import { SubmitButton } from "../_components/submit-button";

const EMPTY_STATE: AuthFormState = {};

export const ForgotPasswordForm = () => {
  const [state, formAction] = useActionState(
    requestPasswordReset,
    EMPTY_STATE,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <AuthFeedback state={state} />

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

      <SubmitButton label="Send reset link" pendingLabel="Sending…" />

      <Link href="/login" className="link link-hover text-sm">
        Back to sign in
      </Link>
    </form>
  );
};
