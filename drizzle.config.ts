import "dotenv/config";

import { defineConfig } from "drizzle-kit";

const schemaFiles = [
  "./src/db/schema/enums.ts",
  "./src/db/schema/brands.ts",
  "./src/db/schema/profiles.ts",
  "./src/db/schema/brand-admins.ts",
  "./src/db/schema/membership-tiers.ts",
  "./src/db/schema/memberships.ts",
  "./src/db/schema/challenges.ts",
  "./src/db/schema/cohorts.ts",
  "./src/db/schema/cohort-members.ts",
  "./src/db/schema/modules.ts",
  "./src/db/schema/lessons.ts",
  "./src/db/schema/lesson-contents.ts",
  "./src/db/schema/lesson-progress.ts",
  "./src/db/schema/email-events.ts",
];

export default defineConfig({
  dialect: "postgresql",
  schema: schemaFiles,
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
