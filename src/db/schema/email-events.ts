import { index, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

import { brands } from "./brands";
import { profiles } from "./profiles";

export const emailEvents = pgTable(
  "email_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    eventKey: text("event_key").notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    unique("email_events_profile_brand_event_uidx").on(
      table.profileId,
      table.brandId,
      table.eventKey,
    ),
    index("email_events_brand_id_idx").on(table.brandId),
  ],
);
