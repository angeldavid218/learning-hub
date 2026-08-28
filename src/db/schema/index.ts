import * as brandAdminsSchema from "./brand-admins";
import * as brandsSchema from "./brands";
import * as challengesSchema from "./challenges";
import * as cohortMembersSchema from "./cohort-members";
import * as cohortsSchema from "./cohorts";
import * as emailEventsSchema from "./email-events";
import * as lessonContentsSchema from "./lesson-contents";
import * as lessonProgressSchema from "./lesson-progress";
import * as lessonsSchema from "./lessons";
import * as membershipTiersSchema from "./membership-tiers";
import * as membershipsSchema from "./memberships";
import * as modulesSchema from "./modules";
import * as profilesSchema from "./profiles";

export const schema = {
  ...brandsSchema,
  ...profilesSchema,
  ...brandAdminsSchema,
  ...membershipTiersSchema,
  ...membershipsSchema,
  ...challengesSchema,
  ...cohortsSchema,
  ...cohortMembersSchema,
  ...modulesSchema,
  ...lessonsSchema,
  ...lessonContentsSchema,
  ...lessonProgressSchema,
  ...emailEventsSchema,
};

export * from "./brand-admins";
export * from "./brands";
export * from "./challenges";
export * from "./cohort-members";
export * from "./cohorts";
export * from "./email-events";
export * from "./enums";
export * from "./lesson-contents";
export * from "./lesson-progress";
export * from "./lessons";
export * from "./membership-tiers";
export * from "./memberships";
export * from "./modules";
export * from "./profiles";
