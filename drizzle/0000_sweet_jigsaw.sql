CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"core" jsonb NOT NULL,
	"prompt" text,
	"dynamic_spec" jsonb DEFAULT 'null'::jsonb,
	"dynamic_answers" jsonb DEFAULT 'null'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
