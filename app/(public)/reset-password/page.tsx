import { type Metadata } from "next";

import { requireUser } from "@/src/auth/session";

import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Choose a new password",
};

export default async function ResetPasswordPage() {
  // Reaching this page means the emailed link already established a session.
  // Without this guard anyone could open the URL and post a new password.
  await requireUser();

  return (
    <>
      <h1 className="card-title text-2xl">Choose a new password</h1>
      <p className="text-base-content/70 text-sm">
        At least 8 characters.
      </p>
      <ResetPasswordForm />
    </>
  );
}
