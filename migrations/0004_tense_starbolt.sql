ALTER TABLE "jobs" ALTER COLUMN "job_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."job_type";--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('Full-time', 'Part-time', 'Contract');--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "job_type" SET DATA TYPE "public"."job_type" USING "job_type"::"public"."job_type";--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "company_name" varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "industry" varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "company_website" varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "contact_person" varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "designation" varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "phone" varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "company_size" varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "gst_number" varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "hiring_needs" text;--> statement-breakpoint
ALTER TABLE "company_enquiries" ADD COLUMN "industry" varchar(255);--> statement-breakpoint
ALTER TABLE "company_enquiries" ADD COLUMN "contact_person" varchar(255);--> statement-breakpoint
ALTER TABLE "company_enquiries" ADD COLUMN "designation" varchar(255);--> statement-breakpoint
ALTER TABLE "company_enquiries" ADD COLUMN "hiring_needs" text;--> statement-breakpoint
ALTER TABLE "company_enquiries" ADD COLUMN "message" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "duration" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "department" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "work_mode" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "responsibilities" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "required_skills" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "preferred_skills" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "min_experience" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "max_experience" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "industry_experience" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "compensation_type" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "min_education" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "certifications" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "tools_and_technologies" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "interview_rounds" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "interview_mode" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "deadline" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "open_positions" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "joining_date" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "perks_and_benefits" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "special_instructions" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "what_will_learn" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "projects_and_tasks" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "education_level" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "eligible_courses" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "mentorship_provided" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "training_provided" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "certificate_provided" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "letter_of_rec_provided" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "ppo_possibility" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "selection_process" text;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "education" varchar(255);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "skills" text;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "experience" varchar(255);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "preferred_domain" varchar(255);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "preferred_job_type" varchar(255);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "portfolio_url" varchar(1024);