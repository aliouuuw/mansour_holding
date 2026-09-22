CREATE TABLE "inventory_field_suggestions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"field" varchar(32) NOT NULL,
	"value" text NOT NULL,
	"use_count" integer DEFAULT 1 NOT NULL,
	"last_used_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "inventory_field_suggestions_field_idx" ON "inventory_field_suggestions" USING btree ("field");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_field_suggestions_field_value_uidx" ON "inventory_field_suggestions" USING btree ("field","value");