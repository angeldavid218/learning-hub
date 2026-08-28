import { index, pgTable, text, unique } from "drizzle-orm/pg-core";

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
  },
  (table) => [
    unique("membership_tiers_brand_slug_uidx").on(table.brandId, table.slug),
    index("membership_tiers_brand_id_idx").on(table.brandId),
  ],
);
