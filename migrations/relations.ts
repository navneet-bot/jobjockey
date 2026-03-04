import { relations } from "drizzle-orm/relations";
import { jobs, applications, companyEnquiries } from "./schema";

export const applicationsRelations = relations(applications, ({one}) => ({
	job: one(jobs, {
		fields: [applications.jobId],
		references: [jobs.id]
	}),
}));

export const jobsRelations = relations(jobs, ({one, many}) => ({
	applications: many(applications),
	companyEnquiry: one(companyEnquiries, {
		fields: [jobs.companyId],
		references: [companyEnquiries.id]
	}),
}));

export const companyEnquiriesRelations = relations(companyEnquiries, ({many}) => ({
	jobs: many(jobs),
}));