CREATE TABLE "kbb_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_key" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "kbb_links_model_key_unique" UNIQUE("model_key")
);
