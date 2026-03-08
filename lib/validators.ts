import * as z from "zod";

export const jobFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  jobType: z.enum(["Full-time", "Part-time", "Contract"]),
  jobCategory: z.literal("job"),
  location: z.string().min(2, "Location is required"),
  experienceLevel: z.enum(["Entry Level", "Mid-Level", "Senior", "Manager"]),
  salary: z.string().optional(),
  department: z.string().optional(),
  workMode: z.string().optional(),
  responsibilities: z.string().optional(),
  requiredSkills: z.string().optional(),
  preferredSkills: z.string().optional(),
  minExperience: z.string().optional(),
  maxExperience: z.string().optional(),
  industryExperience: z.string().optional(),
  compensationType: z.string().optional(),
  minEducation: z.string().optional(),
  certifications: z.string().optional(),
  toolsAndTechnologies: z.string().optional(),
  interviewRounds: z.string().optional(),
  interviewMode: z.string().optional(),
  deadline: z.string().optional(),
  openPositions: z.string().optional(),
  joiningDate: z.string().optional(),
  perksAndBenefits: z.string().optional(),
  specialInstructions: z.string().optional(),
  selectionProcess: z.string().optional(),
  description: z.string().min(50, "Description must be at least 50 characters"),
  applicationUrl: z.string().url("Must be a valid url"),
});

export const internshipFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  jobCategory: z.literal("internship"),
  location: z.string().min(2, "Location is required"),
  duration: z.string().optional(),
  stipend: z.string().optional(),
  department: z.string().optional(),
  workMode: z.string().optional(),
  description: z.string().min(50, "Description must be at least 50 characters"),
  whatWillLearn: z.string().optional(),
  projectsAndTasks: z.string().optional(),
  requiredSkills: z.string().optional(),
  toolsAndTechnologies: z.string().optional(),
  educationLevel: z.string().optional(),
  eligibleCourses: z.string().optional(),
  mentorshipProvided: z.boolean().optional(),
  trainingProvided: z.boolean().optional(),
  certificateProvided: z.boolean().optional(),
  letterOfRecProvided: z.boolean().optional(),
  ppoPossibility: z.boolean().optional(),
  selectionProcess: z.string().optional(),
  openPositions: z.string().optional(),
  joiningDate: z.string().optional(),
  deadline: z.string().optional(),
  applicationUrl: z.string().url("Must be a valid url"),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
export type InternshipFormValues = z.infer<typeof internshipFormSchema>;

export const companyEnquirySchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  industry: z.string().min(2, "Industry is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  designation: z.string().min(2, "Designation is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  companyUrl: z.string().url("Must be a valid url").optional().or(z.literal('')),
  companySize: z.string().min(1, "Company size is required"),
  hiringNeeds: z.string().min(1, "Please select your hiring status"),
  message: z.string().optional(),
  gstNumber: z.string().optional(),
});

export type CompanyEnquiryFormValues = z.infer<typeof companyEnquirySchema>;

export const userProfileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  education: z.string().min(2, "Education details are required"),
  skills: z.string().min(2, "Required to match you with valid opportunities"),
  experience: z.string().min(1, "Experience details are required"),
  preferredDomain: z.string().min(2, "Preferred domain is required"),
  preferredJobType: z.string().min(2, "Preferred job type is required"),
  portfolioUrl: z.string().url("Must be a valid url").optional().or(z.literal('')),
  linkedin: z.string().url("Must be a valid url").optional().or(z.literal('')),
  github: z.string().url("Must be a valid url").optional().or(z.literal('')),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
