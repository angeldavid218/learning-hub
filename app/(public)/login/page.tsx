import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { getSessionUser } from "@/src/auth/session";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

const readParam = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const safeNextPath = (value: string | undefined): string =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : "/";

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  if (await getSessionUser()) {
    redirect("/");
  }

  const params = await searchParams;
  const next = safeNextPath(readParam(params.next));
  const initialError =
    readParam(params.error) === "link_invalid"
      ? "That link has expired or has already been used. Request a new one."
      : undefined;

  return (
    <>
      <h1 className="card-title text-2xl">Sign in</h1>
      <p className="text-base-content/70 text-sm">
        Use the email address your access was set up with.
      </p>
      <LoginForm next={next} initialError={initialError} />
    </>
  );
}
