CREATE TABLE "upscaler " (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"original_image" text NOT NULL,
	"upscaler_image" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
