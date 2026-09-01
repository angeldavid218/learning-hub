import { index, integer, pgTable, text, unique } from "drizzle-orm/pg-core";

import { brands } from "./brands";

export const membershipTiers = pgTable(
  "membership_tiers",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    /**
     * Access level, ascending — higher rank sees more. Gating compares ranks
     * numerically (`studentTier.rank >= module.requiredTier.rank`) instead of
     * comparing slugs, so tiers can be renamed, or a new one inserted between
     * two existing ones, without rewriting the gating rules.
     *
     * Scoped per brand: rank 1 on `agentlabs` and rank 1 on `timerich` are
     * unrelated values, not a shared scale.
     */
    rank: integer("rank").notNull(),
  },
  (table) => [
    unique("membership_tiers_brand_slug_uidx").on(table.brandId, table.slug),
    // Two tiers sharing a rank within a brand would make "is this tier higher?"
    // ambiguous and silently break gating, so the database rejects it.
    unique("membership_tiers_brand_rank_uidx").on(table.brandId, table.rank),
    index("membership_tiers_brand_id_idx").on(table.brandId),
  ],
);
