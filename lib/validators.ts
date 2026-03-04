import * as z from "zod";

export const jobFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  jobType: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  jobCategory: z.enum(["job", "internship", "training"]),
  location: z.string().min(2, "Location is required"),
  experienceLevel: z.enum(["Entry Level", "Mid-Level", "Senior", "Manager"]),
  salary: z.string().optional(),
  description: z.string().min(50, "Description must be at least 50 characters"),
  applicationUrl: z.string().url("Must be a valid url"),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;

export const companyEnquirySchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  companyUrl: z.string().url("Must be a valid url").optional().or(z.literal('')),
  companySize: z.string().min(1, "Company size is required"),
  gstNumber: z.string().optional(),
});

export type CompanyEnquiryFormValues = z.infer<typeof companyEnquirySchema>;

export const userProfileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  linkedin: z.string().url("Must be a valid url").optional().or(z.literal('')),
  github: z.string().url("Must be a valid url").optional().or(z.literal('')),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
