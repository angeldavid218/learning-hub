import { index, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { brands } from "./brands";
import { membershipStatusEnum } from "./enums";
import { membershipTiers } from "./membership-tiers";
import { profiles } from "./profiles";

export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    tierId: text("tier_id")
      .notNull()
      .references(() => membershipTiers.id, { onDelete: "restrict" }),
    status: membershipStatusEnum("status").notNull().default("active"),
  },
  (table) => [
    index("memberships_profile_id_idx").on(table.profileId),
    index("memberships_brand_id_idx").on(table.brandId),
    index("memberships_tier_id_idx").on(table.tierId),
    uniqueIndex("memberships_profile_brand_active_uidx")
      .on(table.profileId, table.brandId)
      .where(sql`${table.status} = 'active'`),
  ],
);
