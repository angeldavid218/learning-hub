import { pgEnum } from "drizzle-orm/pg-core";

export const membershipStatusEnum = pgEnum("membership_status", [
  "active",
  "inactive",
  "cancelled",
]);

export const lessonContentTypeEnum = pgEnum("lesson_content_type", [
  "video",
  "file",
  "text",
  "link",
]);
