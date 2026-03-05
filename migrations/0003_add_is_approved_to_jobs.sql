ALTER TABLE "company_enquiries" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "company_name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "phone" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "company_url" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "company_size" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "gst_number" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."enquiry_status";--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "status" SET DATA TYPE "public"."enquiry_status" USING "status"::"public"."enquiry_status";--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "submitted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "company_enquiries" ALTER COLUMN "submitted_at" SET DEFAULT now();