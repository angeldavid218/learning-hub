CREATE TYPE "lesson_content_type" AS ENUM('video', 'file', 'text', 'link');--> statement-breakpoint
CREATE TYPE "membership_status" AS ENUM('active', 'inactive', 'cancelled');--> statement-breakpoint
CREATE TABLE "brands" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"theme" text NOT NULL,
	"primary_host" text NOT NULL,
	"host_aliases" jsonb DEFAULT '[]' NOT NULL,
	"email_from" text,
	"email_reply_to" text
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY,
	"display_name" text
);
--> statement-breakpoint
CREATE TABLE "brand_admins" (
	"profile_id" uuid,
	"brand_id" text,
	CONSTRAINT "brand_admins_pkey" PRIMARY KEY("profile_id","brand_id")
);
--> statement-breakpoint
CREATE TABLE "membership_tiers" (
	"id" text PRIMARY KEY,
	"brand_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "membership_tiers_brand_slug_uidx" UNIQUE("brand_id","slug")
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"profile_id" uuid NOT NULL,
	"brand_id" text NOT NULL,
	"tier_id" text NOT NULL,
	"status" "membership_status" DEFAULT 'active'::"membership_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"brand_id" text NOT NULL,
	"title" text NOT NULL,
	"duration_days" integer DEFAULT 40 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cohorts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"challenge_id" uuid NOT NULL,
	"starts_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cohort_members" (
	"profile_id" uuid,
	"cohort_id" uuid,
	CONSTRAINT "cohort_members_pkey" PRIMARY KEY("profile_id","cohort_id")
);
--> statement-breakpoint
CREATE TABLE "modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"challenge_id" uuid NOT NULL,
	"title" text NOT NULL,
	"required_tier_id" text NOT NULL,
	"sort_order" integer NOT NULL,
	"unlock_offset" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"module_id" uuid NOT NULL,
	"title" text NOT NULL,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_contents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"lesson_id" uuid NOT NULL,
	"type" "lesson_content_type" NOT NULL,
	"title" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"body" text,
	"url" text,
	"vimeo_id" text,
	"storage_path" text
);
--> statement-breakpoint
CREATE TABLE "lesson_progress" (
	"profile_id" uuid,
	"lesson_id" uuid,
	"completed_at" timestamp with time zone NOT NULL,
	CONSTRAINT "lesson_progress_pkey" PRIMARY KEY("profile_id","lesson_id")
);
--> statement-breakpoint
CREATE TABLE "email_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"profile_id" uuid NOT NULL,
	"brand_id" text NOT NULL,
	"event_key" text NOT NULL,
	"sent_at" timestamp with time zone NOT NULL,
	CONSTRAINT "email_events_profile_brand_event_uidx" UNIQUE("profile_id","brand_id","event_key")
);
--> statement-breakpoint
CREATE INDEX "membership_tiers_brand_id_idx" ON "membership_tiers" ("brand_id");--> statement-breakpoint
CREATE INDEX "memberships_profile_id_idx" ON "memberships" ("profile_id");--> statement-breakpoint
CREATE INDEX "memberships_brand_id_idx" ON "memberships" ("brand_id");--> statement-breakpoint
CREATE INDEX "memberships_tier_id_idx" ON "memberships" ("tier_id");--> statement-breakpoint
CREATE UNIQUE INDEX "memberships_profile_brand_active_uidx" ON "memberships" ("profile_id","brand_id") WHERE "status" = 'active';--> statement-breakpoint
CREATE INDEX "challenges_brand_id_idx" ON "challenges" ("brand_id");--> statement-breakpoint
CREATE INDEX "cohorts_challenge_id_idx" ON "cohorts" ("challenge_id");--> statement-breakpoint
CREATE INDEX "cohort_members_cohort_id_idx" ON "cohort_members" ("cohort_id");--> statement-breakpoint
CREATE INDEX "modules_challenge_id_idx" ON "modules" ("challenge_id");--> statement-breakpoint
CREATE INDEX "modules_required_tier_id_idx" ON "modules" ("required_tier_id");--> statement-breakpoint
CREATE INDEX "lessons_module_id_idx" ON "lessons" ("module_id");--> statement-breakpoint
CREATE INDEX "lesson_contents_lesson_id_idx" ON "lesson_contents" ("lesson_id");--> statement-breakpoint
CREATE INDEX "lesson_progress_lesson_id_idx" ON "lesson_progress" ("lesson_id");--> statement-breakpoint
CREATE INDEX "email_events_brand_id_idx" ON "email_events" ("brand_id");--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "brand_admins" ADD CONSTRAINT "brand_admins_profile_id_profiles_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "brand_admins" ADD CONSTRAINT "brand_admins_brand_id_brands_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "membership_tiers" ADD CONSTRAINT "membership_tiers_brand_id_brands_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_profile_id_profiles_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_brand_id_brands_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_tier_id_membership_tiers_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "membership_tiers"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_brand_id_brands_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "cohorts" ADD CONSTRAINT "cohorts_challenge_id_challenges_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "cohort_members" ADD CONSTRAINT "cohort_members_profile_id_profiles_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "cohort_members" ADD CONSTRAINT "cohort_members_cohort_id_cohorts_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "modules" ADD CONSTRAINT "modules_challenge_id_challenges_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "modules" ADD CONSTRAINT "modules_required_tier_id_membership_tiers_id_fkey" FOREIGN KEY ("required_tier_id") REFERENCES "membership_tiers"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_module_id_modules_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "lesson_contents" ADD CONSTRAINT "lesson_contents_lesson_id_lessons_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_profile_id_profiles_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_lessons_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "email_events" ADD CONSTRAINT "email_events_profile_id_profiles_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "email_events" ADD CONSTRAINT "email_events_brand_id_brands_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE;