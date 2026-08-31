import "server-only";

import { headers } from "next/headers";

import type { ResolvedBrand } from "./types";

const BRANDS: Record<string, ResolvedBrand> = {
  agentlabs: {
    id: "agentlabs",
    name: "The Agent Labs",
    theme: "agentlabs",
  },
  timerich: {
    id: "timerich",
    name: "Time Rich",
    theme: "timerich",
  },
};

const DEFAULT_BRAND = BRANDS.timerich;

const readHostMap = (): Record<string, string> => {
  const raw = process.env.BRAND_HOST_MAP;

  if (!raw) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    );
  } catch {
    return {};
  }
};

/**
 * Maps the request Host header to a brand row.
 *
 * Local dev defaults to `agentlabs` on localhost unless `BRAND_HOST_MAP` overrides.
 * DB lookup can replace the static table once brands are seeded.
 */
export const resolveBrand = async (): Promise<ResolvedBrand> => {
  const headerList = await headers();
  const hostHeader =
    headerList.get("x-forwarded-host") ??
    headerList.get("host") ??
    "localhost:3000";
  const host = hostHeader.toLowerCase();

  const mappedId = readHostMap()[host];

  if (mappedId && mappedId in BRANDS) {
    return BRANDS[mappedId];
  }

  if (host.includes("timerich")) {
    return BRANDS.timerich;
  }

  return DEFAULT_BRAND;
};
