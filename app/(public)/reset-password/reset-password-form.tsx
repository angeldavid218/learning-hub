"use client";

import { useActionState } from "react";

import { updatePassword, type AuthFormState } from "@/src/auth/actions";

import { AuthFeedback } from "../_components/auth-feedback";
import { SubmitButton } from "../_components/submit-button";

const EMPTY_STATE: AuthFormState = {};

export const ResetPasswordForm = () => {
  const [state, formAction] = useActionState(updatePassword, EMPTY_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <AuthFeedback state={state} />

      <label className="form-control w-full">
        <span className="label-text mb-1 block">New password</span>
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="input input-bordered w-full"
        />
      </label>

      <label className="form-control w-full">
        <span className="label-text mb-1 block">Confirm new password</span>
        <input
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          minLength={8}
          required
          className="input input-bordered w-full"
        />
      </label>

      <SubmitButton label="Save password" pendingLabel="Saving…" />
    </form>
  );
};
