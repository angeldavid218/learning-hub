/**
 * Request header published by proxy.ts carrying the current pathname.
 *
 * Kept in its own dependency-free module: proxy.ts runs ahead of the render
 * pipeline and should not pull `next/headers` or `server-only` into its bundle.
 */
export const PATHNAME_HEADER = "x-pathname";
