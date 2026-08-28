import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { brands } from "./brands";

export const challenges = pgTable(
  "challenges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    durationDays: integer("duration_days").notNull().default(40),
  },
  (table) => [index("challenges_brand_id_idx").on(table.brandId)],
);
