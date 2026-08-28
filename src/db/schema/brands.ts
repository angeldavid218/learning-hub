import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const brands = pgTable("brands", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  theme: text("theme").notNull(),
  primaryHost: text("primary_host").notNull(),
  hostAliases: jsonb("host_aliases").$type<string[]>().notNull().default([]),
  emailFrom: text("email_from"),
  emailReplyTo: text("email_reply_to"),
});
