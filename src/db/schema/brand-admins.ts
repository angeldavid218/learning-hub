import { pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";

import { brands } from "./brands";
import { profiles } from "./profiles";

export const brandAdmins = pgTable(
  "brand_admins",
  {
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.profileId, table.brandId] })],
);
