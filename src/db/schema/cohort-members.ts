import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

import { cohorts } from "./cohorts";
import { profiles } from "./profiles";

export const cohortMembers = pgTable(
  "cohort_members",
  {
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    cohortId: uuid("cohort_id")
      .notNull()
      .references(() => cohorts.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.profileId, table.cohortId] }),
    index("cohort_members_cohort_id_idx").on(table.cohortId),
  ],
);
