CREATE TABLE "connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listener_user_id" uuid NOT NULL,
	"venter_user_id" uuid NOT NULL,
	"status" text DEFAULT 'connecting' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"ended_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "queue_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"role" text NOT NULL,
	"telegram_username" text,
	"is_online" boolean DEFAULT true,
	"joined_at" timestamp DEFAULT now(),
	"last_seen" timestamp DEFAULT now(),
	CONSTRAINT "queue_users_session_id_unique" UNIQUE("session_id")
);
