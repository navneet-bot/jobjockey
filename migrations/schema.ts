import { pgTable, uuid, varchar, timestamp, unique, boolean, foreignKey, text, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const applicationStatus = pgEnum("application_status", ['pending', 'shortlisted', 'interview', 'waiting', 'selected', 'rejected'])
export const enquiryStatus = pgEnum("enquiry_status", ['pending', 'approved', 'rejected'])
export const experienceLevel = pgEnum("experience_level", ['Entry Level', 'Mid-Level', 'Senior', 'Manager'])
export const jobCategory = pgEnum("job_category", ['job', 'internship', 'training'])
export const jobType = pgEnum("job_type", ['Full-time', 'Part-time', 'Contract', 'Internship'])


export const companyEnquiries = pgTable("company_enquiries", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyName: varchar("company_name", { length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 255 }).notNull(),
	companyUrl: varchar("company_url", { length: 255 }),
	companySize: varchar("company_size", { length: 255 }).notNull(),
	gstNumber: varchar("gst_number", { length: 255 }),
	status: enquiryStatus().default('pending').notNull(),
	submittedAt: timestamp("submitted_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: varchar("user_id", { length: 255 }),
});

export const userProfiles = pgTable("user_profiles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	linkedin: varchar({ length: 255 }),
	github: varchar({ length: 255 }),
	resumeUrl: varchar("resume_url", { length: 1024 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("user_profiles_user_id_unique").on(table.userId),
]);

export const companies = pgTable("companies", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	isVerified: boolean("is_verified").default(false).notNull(),
}, (table) => [
	unique("companies_user_id_unique").on(table.userId),
]);

export const applications = pgTable("applications", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	jobId: uuid("job_id").notNull(),
	resumeUrl: varchar("resume_url", { length: 1024 }),
	status: applicationStatus().default('pending').notNull(),
	appliedAt: timestamp("applied_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.jobId],
			foreignColumns: [jobs.id],
			name: "applications_job_id_jobs_id_fk"
		}).onDelete("cascade"),
]);

export const jobs = pgTable("jobs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	company: varchar({ length: 255 }).notNull(),
	location: varchar({ length: 255 }).notNull(),
	jobType: jobType("job_type").notNull(),
	jobCategory: jobCategory("job_category").default('job').notNull(),
	experienceLevel: experienceLevel("experience_level").notNull(),
	salary: varchar({ length: 255 }),
	description: text().notNull(),
	applicationUrl: varchar("application_url").notNull(),
	isApproved: boolean("is_approved").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	postedBy: varchar("posted_by", { length: 255 }).notNull(),
	companyId: uuid("company_id"),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [companyEnquiries.id],
			name: "jobs_company_id_company_enquiries_id_fk"
		}).onDelete("cascade"),
]);
