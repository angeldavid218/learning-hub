import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { lessonContentTypeEnum } from "./enums";
import { lessons } from "./lessons";

export const lessonContents = pgTable(
  "lesson_contents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    type: lessonContentTypeEnum("type").notNull(),
    title: text("title"),
    sortOrder: integer("sort_order").notNull().default(0),
    body: text("body"),
    url: text("url"),
    vimeoId: text("vimeo_id"),
    storagePath: text("storage_path"),
  },
  (table) => [index("lesson_contents_lesson_id_idx").on(table.lessonId)],
);
