ALTER TABLE "membership_tiers" ADD COLUMN "rank" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "membership_tiers" ADD CONSTRAINT "membership_tiers_brand_rank_uidx" UNIQUE("brand_id","rank");