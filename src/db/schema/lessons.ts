import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { modules } from "./modules";

export const lessons = pgTable(
  "lessons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    sortOrder: integer("sort_order").notNull(),
  },
  (table) => [index("lessons_module_id_idx").on(table.moduleId)],
);
