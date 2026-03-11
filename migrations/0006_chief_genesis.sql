-- Migration: Add admin_roles and company_settings tables
-- Only contains net-new DDL (existing tables/enums from prior migrations are excluded)

CREATE TABLE IF NOT EXISTS "admin_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"role" varchar(100) DEFAULT 'admin' NOT NULL,
	"can_manage_companies" boolean DEFAULT true NOT NULL,
	"can_manage_jobs" boolean DEFAULT true NOT NULL,
	"can_manage_settings" boolean DEFAULT false NOT NULL,
	"can_view_applications" boolean DEFAULT true NOT NULL,
	"can_manage_chat" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_roles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "company_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"max_job_posts" integer,
	"max_internship_posts" integer,
	"job_expiry_days" integer,
	"internship_expiry_days" integer,
	"disable_job_posting" boolean DEFAULT false NOT NULL,
	"disable_internship_posting" boolean DEFAULT false NOT NULL,
	"hide_company" boolean DEFAULT false NOT NULL,
	"allow_custom_expiry" boolean DEFAULT false NOT NULL,
	"unlimited_posting" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "company_settings_company_id_unique" UNIQUE("company_id")
);
--> statement-breakpoint
ALTER TABLE "company_settings" ADD CONSTRAINT "company_settings_company_id_company_enquiries_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company_enquiries"("id") ON DELETE cascade ON UPDATE no action;