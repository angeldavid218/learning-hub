/**
 * Shared helpers for reading untrusted values out of URLs.
 *
 * Deliberately dependency-free — no `server-only`, no Next imports — so this
 * stays usable from Server Components, Route Handlers, and Server Actions
 * alike. Nothing here touches secrets.
 */

/**
 * Only allow relative, single-slash paths through as redirect destinations.
 * Anything else — an absolute URL, or a protocol-relative `//evil.com` — lets
 * an attacker turn our own redirects into an open redirect.
 *
 * Accepts `null`/`undefined` so callers can hand over a raw lookup result
 * (`searchParams.get()`, an optional param) without pre-checking it.
 */
export const safeNextPath = (value: string | null | undefined): string =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : "/";

/**
 * Collapse a Next.js search param to a single value.
 *
 * A repeated query string (`?next=/a&next=/b`) arrives as an array, so callers
 * that expect one value need narrowing before they can use it.
 */
export const readParam = (
  value: string | string[] | undefined,
): string | undefined => (Array.isArray(value) ? value[0] : value);
