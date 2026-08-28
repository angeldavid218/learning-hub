import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { challenges } from "./challenges";
import { membershipTiers } from "./membership-tiers";

export const modules = pgTable(
  "modules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    challengeId: uuid("challenge_id")
      .notNull()
      .references(() => challenges.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    requiredTierId: text("required_tier_id")
      .notNull()
      .references(() => membershipTiers.id, { onDelete: "restrict" }),
    sortOrder: integer("sort_order").notNull(),
    unlockOffset: integer("unlock_offset").notNull().default(0),
  },
  (table) => [
    index("modules_challenge_id_idx").on(table.challengeId),
    index("modules_required_tier_id_idx").on(table.requiredTierId),
  ],
);
