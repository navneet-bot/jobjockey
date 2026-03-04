import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const jobTypeEnum = pgEnum("job_type", [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
]);

export const experienceLevelEnum = pgEnum("experience_level", [
  "Entry Level",
  "Mid-Level",
  "Senior",
  "Manager",
]);

export const jobCategoryEnum = pgEnum("job_category", [
  "job",
  "internship",
  "training",
]);

export const companyEnquiryStatusEnum = pgEnum("enquiry_status", [
  "pending",
  "approved",
  "rejected",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "shortlisted",
  "interview",
  "waiting",
  "selected",
  "rejected",
]);

export const userProfilesTable = pgTable("user_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(), // Clerk user ID
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  linkedin: varchar("linkedin", { length: 255 }),
  github: varchar("github", { length: 255 }),
  resumeUrl: varchar("resume_url", { length: 1024 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const companiesTable = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(), // Clerk user ID mapping
  isVerified: boolean("is_verified").default(false).notNull(),
});

export const companyEnquiriesTable = pgTable("company_enquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }), // Track who submitted it
  companyName: varchar("company_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).notNull(),
  companyUrl: varchar("company_url", { length: 255 }),
  companySize: varchar("company_size", { length: 255 }).notNull(),
  gstNumber: varchar("gst_number", { length: 255 }),
  status: companyEnquiryStatusEnum("status").default("pending").notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const jobsTable = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").references(() => companyEnquiriesTable.id, { onDelete: "cascade" }),
  postedBy: varchar("posted_by", { length: 255 }).notNull(), // Clerk UserId of the Company
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  jobType: jobTypeEnum("job_type").notNull(),
  jobCategory: jobCategoryEnum("job_category").default("job").notNull(),
  experienceLevel: experienceLevelEnum("experience_level").notNull(),
  salary: varchar("salary", { length: 255 }),
  description: text("description").notNull(),
  applicationUrl: varchar("application_url").notNull(),
  isApproved: boolean("is_approved").default(false).notNull(), // Admin approval flag
  postedAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const applicationsTable = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobId: uuid("job_id")
    .references(() => jobsTable.id, { onDelete: "cascade" })
    .notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(), // Clerk user ID of applicant
  resumeUrl: varchar("resume_url", { length: 1024 }),
  status: applicationStatusEnum("status").default("pending").notNull(),
  appliedAt: timestamp("applied_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type NewJob = typeof jobsTable.$inferInsert;
export type Job = typeof jobsTable.$inferSelect;

export type NewCompanyEnquiry = typeof companyEnquiriesTable.$inferInsert;
export type CompanyEnquiry = typeof companyEnquiriesTable.$inferSelect;

export type NewCompany = typeof companiesTable.$inferInsert;
export type Company = typeof companiesTable.$inferSelect;

export type NewUserProfile = typeof userProfilesTable.$inferInsert;
export type UserProfile = typeof userProfilesTable.$inferSelect;

export type NewApplication = typeof applicationsTable.$inferInsert;
export type Application = typeof applicationsTable.$inferSelect;
