import {
  boolean,
  integer,
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

export const notificationTypeEnum = pgEnum("notification_type", [
  "application_received",
  "application_status_updated",
  "job_approved",
  "job_rejected",
  "company_approved",
  "company_rejected",
  "new_enquiry",
  "profile_updated",
  "resume_uploaded",
]);

export const chatSenderRoleEnum = pgEnum("chat_sender_role", ["admin", "employer"]);

export const userProfilesTable = pgTable("user_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(), // Clerk user ID
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  education: varchar("education", { length: 255 }),
  skills: text("skills"),
  experience: varchar("experience", { length: 255 }),
  preferredDomain: varchar("preferred_domain", { length: 255 }),
  preferredJobType: varchar("preferred_job_type", { length: 255 }),
  portfolioUrl: varchar("portfolio_url", { length: 1024 }),
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
  companyName: varchar("company_name", { length: 255 }),
  description: text("description"),
  industry: varchar("industry", { length: 255 }),
  companyWebsite: varchar("company_website", { length: 255 }),
  contactPerson: varchar("contact_person", { length: 255 }),
  designation: varchar("designation", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  companySize: varchar("company_size", { length: 255 }),
  gstNumber: varchar("gst_number", { length: 255 }),
  hiringNeeds: text("hiring_needs"),
  isVerified: boolean("is_verified").default(false).notNull(),
});

export const companyEnquiriesTable = pgTable("company_enquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }), // Track who submitted it
  companyName: varchar("company_name", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 255 }),
  contactPerson: varchar("contact_person", { length: 255 }),
  designation: varchar("designation", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).notNull(),
  companyUrl: varchar("company_url", { length: 255 }),
  companySize: varchar("company_size", { length: 255 }).notNull(),
  hiringNeeds: text("hiring_needs"),
  message: text("message"),
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
  experienceLevel: experienceLevelEnum("experience_level").notNull(),
  salary: varchar("salary", { length: 255 }),
  department: text("department"),
  workMode: text("work_mode"), // Remote, Hybrid, On-site
  responsibilities: text("responsibilities"),
  requiredSkills: text("required_skills"),
  preferredSkills: text("preferred_skills"),
  minExperience: text("min_experience"),
  maxExperience: text("max_experience"),
  industryExperience: text("industry_experience"),
  compensationType: text("compensation_type"),
  minEducation: text("min_education"),
  certifications: text("certifications"),
  toolsAndTechnologies: text("tools_and_technologies"),
  interviewRounds: text("interview_rounds"),
  interviewMode: text("interview_mode"),
  deadline: text("deadline"),
  openPositions: text("open_positions"),
  joiningDate: text("joining_date"),
  perksAndBenefits: text("perks_and_benefits"),
  specialInstructions: text("special_instructions"),
  selectionProcess: text("selection_process"),
  description: text("description").notNull(),
  applicationUrl: varchar("application_url").notNull(),
  isApproved: boolean("is_approved").default(false).notNull(), // Admin approval flag
  expiryDate: timestamp("expiry_date", { withTimezone: true }),
  isExpired: boolean("is_expired").default(false).notNull(),
  postedAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const internshipsTable = pgTable("internships", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").references(() => companyEnquiriesTable.id, { onDelete: "cascade" }),
  postedBy: varchar("posted_by", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  duration: text("duration"), // Duration of internship
  stipend: varchar("stipend", { length: 255 }),
  department: text("department"),
  workMode: text("work_mode"),
  description: text("description").notNull(),
  whatWillLearn: text("what_will_learn"),
  projectsAndTasks: text("projects_and_tasks"),
  requiredSkills: text("required_skills"),
  toolsAndTechnologies: text("tools_and_technologies"),
  educationLevel: text("education_level"),
  eligibleCourses: text("eligible_courses"),
  mentorshipProvided: boolean("mentorship_provided").default(false),
  trainingProvided: boolean("training_provided").default(false),
  certificateProvided: boolean("certificate_provided").default(false),
  letterOfRecProvided: boolean("letter_of_rec_provided").default(false),
  ppoPossibility: boolean("ppo_possibility").default(false),
  selectionProcess: text("selection_process"),
  openPositions: text("open_positions"),
  joiningDate: text("joining_date"),
  deadline: text("deadline"),
  applicationUrl: varchar("application_url").notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  expiryDate: timestamp("expiry_date", { withTimezone: true }),
  isExpired: boolean("is_expired").default(false).notNull(),
  postedAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const applicationsTable = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobId: uuid("job_id")
    .references(() => jobsTable.id, { onDelete: "cascade" }),
  internshipId: uuid("internship_id")
    .references(() => internshipsTable.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }).notNull(), // Clerk user ID of applicant
  resumeUrl: varchar("resume_url", { length: 1024 }),
  status: applicationStatusEnum("status").default("pending").notNull(),
  appliedAt: timestamp("applied_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const notificationsTable = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(), // Clerk user ID
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  link: varchar("link", { length: 1024 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const chatConversationsTable = pgTable("chat_conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: varchar("company_id", { length: 255 }).notNull().unique(), // Clerk user ID of employer
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const chatMessagesTable = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id")
    .references(() => chatConversationsTable.id, { onDelete: "cascade" })
    .notNull(),
  senderId: varchar("sender_id", { length: 255 }).notNull(), // Clerk user ID
  senderRole: chatSenderRoleEnum("sender_role").notNull(),
  message: text("message"),
  attachmentUrl: text("attachment_url"),
  attachmentName: text("attachment_name"),
  attachmentType: text("attachment_type"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const platformSettingsTable = pgTable("platform_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  maxJobPostsPerCompany: integer("max_job_posts_per_company").default(10).notNull(),
  maxInternshipPostsPerCompany: integer("max_internship_posts_per_company").default(10).notNull(),
  jobDefaultExpiryDays: integer("job_default_expiry_days").default(30).notNull(),
  internshipDefaultExpiryDays: integer("internship_default_expiry_days").default(30).notNull(),
  allowCompaniesToChooseExpiry: boolean("allow_companies_to_choose_expiry").default(false).notNull(),
  showCompaniesPublicly: boolean("show_companies_publicly").default(true).notNull(),
  showJobsPublicly: boolean("show_jobs_publicly").default(true).notNull(),
  showInternshipsPublicly: boolean("show_internships_publicly").default(true).notNull(),
  autoDeleteExpiredPosts: boolean("auto_delete_expired_posts").default(false).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type NewPlatformSetting = typeof platformSettingsTable.$inferInsert;
export type PlatformSetting = typeof platformSettingsTable.$inferSelect;

// Company-specific restriction overrides
export const companySettingsTable = pgTable("company_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companyEnquiriesTable.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  maxJobPosts: integer("max_job_posts"), // null = fall back to global
  maxInternshipPosts: integer("max_internship_posts"), // null = fall back to global
  jobExpiryDays: integer("job_expiry_days"), // null = fall back to global
  internshipExpiryDays: integer("internship_expiry_days"), // null = fall back to global
  disableJobPosting: boolean("disable_job_posting").default(false).notNull(),
  disableInternshipPosting: boolean("disable_internship_posting").default(false).notNull(),
  hideCompany: boolean("hide_company").default(false).notNull(),
  allowCustomExpiry: boolean("allow_custom_expiry").default(false).notNull(),
  unlimitedPosting: boolean("unlimited_posting").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type NewCompanySetting = typeof companySettingsTable.$inferInsert;
export type CompanySetting = typeof companySettingsTable.$inferSelect;

// Granular admin permission roles
export const adminRolesTable = pgTable("admin_roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(), // Clerk userId
  role: varchar("role", { length: 100 }).notNull().default("admin"),
  canManageCompanies: boolean("can_manage_companies").default(true).notNull(),
  canManageJobs: boolean("can_manage_jobs").default(true).notNull(),
  canManageSettings: boolean("can_manage_settings").default(false).notNull(),
  canViewApplications: boolean("can_view_applications").default(true).notNull(),
  canManageChat: boolean("can_manage_chat").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type NewAdminRole = typeof adminRolesTable.$inferInsert;
export type AdminRole = typeof adminRolesTable.$inferSelect;

export type NewJob = typeof jobsTable.$inferInsert;
export type Job = typeof jobsTable.$inferSelect;

export type NewInternship = typeof internshipsTable.$inferInsert;
export type Internship = typeof internshipsTable.$inferSelect;

export type NewCompanyEnquiry = typeof companyEnquiriesTable.$inferInsert;
export type CompanyEnquiry = typeof companyEnquiriesTable.$inferSelect;

export type NewCompany = typeof companiesTable.$inferInsert;
export type Company = typeof companiesTable.$inferSelect;

export type NewUserProfile = typeof userProfilesTable.$inferInsert;
export type UserProfile = typeof userProfilesTable.$inferSelect;

export type NewApplication = typeof applicationsTable.$inferInsert;
export type Application = typeof applicationsTable.$inferSelect;

export type NewNotification = typeof notificationsTable.$inferInsert;
export type Notification = typeof notificationsTable.$inferSelect;

export type NewChatConversation = typeof chatConversationsTable.$inferInsert;
export type ChatConversation = typeof chatConversationsTable.$inferSelect;

export type NewChatMessage = typeof chatMessagesTable.$inferInsert;
export type ChatMessage = typeof chatMessagesTable.$inferSelect;
