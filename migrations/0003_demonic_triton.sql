ALTER TYPE "public"."application_status" ADD VALUE 'waiting' BEFORE 'selected';--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	CONSTRAINT "companies_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "applications" RENAME COLUMN "applicant_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "jobs" RENAME COLUMN "user_id" TO "company_id";--> statement-breakpoint
ALTER TABLE "user_profiles" RENAME COLUMN "clerk_user_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_clerk_user_id_unique";--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "company_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "phone" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "company_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "company_size" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "gst_number" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "submitted_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "submitted_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "company_enquiries" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "posted_by" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_company_id_company_enquiries_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company_enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id");