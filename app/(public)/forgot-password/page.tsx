import { type Metadata } from "next";

import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="card-title text-2xl">Reset your password</h1>
      <p className="text-base-content/70 text-sm">
        We will email you a link to choose a new password.
      </p>
      <ForgotPasswordForm />
    </>
  );
}
