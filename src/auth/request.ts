import "server-only";

import { headers } from "next/headers";

import { PATHNAME_HEADER } from "./headers";

export { PATHNAME_HEADER };

/**
 * Origin of the current request, used to build absolute callback URLs for
 * Supabase email links. Derived from the Host header so it stays correct for
 * whichever brand domain the request arrived on.
 */
export const getRequestOrigin = async (): Promise<string> => {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");

  if (!host) {
    throw new Error("Cannot resolve request origin: no Host header");
  }

  const protocol =
    headerList.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
};

/**
 * Path of the page currently being rendered, published by proxy.ts. Used to
 * send a signed-out visitor back where they were after logging in.
 */
export const getRequestPathname = async (): Promise<string | null> => {
  const headerList = await headers();
  return headerList.get(PATHNAME_HEADER);
};
