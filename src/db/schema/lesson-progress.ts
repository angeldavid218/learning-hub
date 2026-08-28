import { index, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";

import { lessons } from "./lessons";
import { profiles } from "./profiles";

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.profileId, table.lessonId] }),
    index("lesson_progress_lesson_id_idx").on(table.lessonId),
  ],
);
