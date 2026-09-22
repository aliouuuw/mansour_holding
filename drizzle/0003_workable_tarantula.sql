ALTER TABLE "vehicles" ADD COLUMN "arrived_at" timestamp;--> statement-breakpoint
UPDATE "vehicles" SET "arrived_at" = "created_at" WHERE "arrived_at" IS NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "arrived_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "arrived_at" SET DEFAULT now();
