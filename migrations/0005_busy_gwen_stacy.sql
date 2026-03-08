CREATE TABLE "internships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid,
	"posted_by" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL,
	"job_category" "job_category" DEFAULT 'internship' NOT NULL,
	"duration" text,
	"stipend" varchar(255),
	"department" text,
	"work_mode" text,
	"description" text NOT NULL,
	"what_will_learn" text,
	"projects_and_tasks" text,
	"required_skills" text,
	"tools_and_technologies" text,
	"education_level" text,
	"eligible_courses" text,
	"mentorship_provided" boolean DEFAULT false,
	"training_provided" boolean DEFAULT false,
	"certificate_provided" boolean DEFAULT false,
	"letter_of_rec_provided" boolean DEFAULT false,
	"ppo_possibility" boolean DEFAULT false,
	"selection_process" text,
	"open_positions" text,
	"joining_date" text,
	"deadline" text,
	"application_url" varchar NOT NULL,
	"is_approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "job_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "internship_id" uuid;--> statement-breakpoint
ALTER TABLE "internships" ADD CONSTRAINT "internships_company_id_company_enquiries_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company_enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_internship_id_internships_id_fk" FOREIGN KEY ("internship_id") REFERENCES "public"."internships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "duration";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "what_will_learn";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "projects_and_tasks";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "education_level";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "eligible_courses";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "mentorship_provided";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "training_provided";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "certificate_provided";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "letter_of_rec_provided";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "ppo_possibility";