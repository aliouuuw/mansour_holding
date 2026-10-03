ALTER TABLE "vehicles" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
WITH ranked AS (
  SELECT "id", (row_number() OVER (ORDER BY "arrived_at" DESC, "created_at" DESC) - 1)::integer AS ord
  FROM "vehicles"
)
UPDATE "vehicles" AS v
SET "sort_order" = ranked.ord
FROM ranked
WHERE v."id" = ranked."id";--> statement-breakpoint
CREATE INDEX "vehicles_sort_order_idx" ON "vehicles" USING btree ("sort_order");