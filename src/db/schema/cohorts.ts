import { index, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { challenges } from "./challenges";

export const cohorts = pgTable(
  "cohorts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    challengeId: uuid("challenge_id")
      .notNull()
      .references(() => challenges.id, { onDelete: "cascade" }),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("cohorts_challenge_id_idx").on(table.challengeId)],
);
