"use server";

import { db } from "@/lib/db";
import { jobsTable, NewJob } from "@/lib/schema";
import { jobFormSchema } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { userProfilesTable, companyEnquiriesTable } from "@/lib/schema";

type JobFormData = {
  title: string;
  jobType: "Full-time" | "Part-time" | "Contract";
  location: string;
  experienceLevel: "Entry Level" | "Mid-Level" | "Senior" | "Manager";
  salary?: string;
  department?: string;
  workMode?: string;
  responsibilities?: string;
  requiredSkills?: string;
  preferredSkills?: string;
  minExperience?: string;
  maxExperience?: string;
  industryExperience?: string;
  compensationType?: string;
  minEducation?: string;
  certifications?: string;
  toolsAndTechnologies?: string;
  interviewRounds?: string;
  interviewMode?: string;
  deadline?: string;
  openPositions?: string;
  joiningDate?: string;
  perksAndBenefits?: string;
  specialInstructions?: string;
  selectionProcess?: string;
  description: string;
  applicationUrl: string;
};

export async function getJobs() {
  try {
    const jobs = await db
      .select()
      .from(jobsTable)
      .orderBy(desc(jobsTable.postedAt));

    return jobs;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getSingleJob(id: string) {
  try {
    const [job] = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.id, id))
      .limit(1);

    return job ?? null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function createJob(jobData: JobFormData) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const validation = jobFormSchema.safeParse(jobData);
  if (!validation.success) {
    return { success: false, error: "Invalid form data provided" };
  }

  try {
    // 1. Fetch the user's approved company enquiry
    const [enquiry] = await db
      .select()
      .from(companyEnquiriesTable)
      .where(
        and(
          eq(companyEnquiriesTable.userId, userId),
          eq(companyEnquiriesTable.status, "approved")
        )
      )
      .limit(1);

    if (!enquiry) {
      return {
        success: false,
        error: "You cannot post jobs until your company is verified by admin.",
      };
    }

    const { jobCategory, ...jobData } = validation.data;

    await db.insert(jobsTable).values({
      ...jobData,
      companyId: enquiry.id,
      company: enquiry.companyName,
      postedBy: userId,
      isApproved: true,
    });

    revalidatePath("/");
    revalidatePath("/admin/jobs");
    revalidatePath("/company/jobs");
    return { success: true };
  } catch (error) {
    console.error("Failed to create job:", error);
    return { success: false, error: "Failed to create the job" };
  }
}

export async function getMyJobs() {
  const { userId } = await auth();
  const activeUserId = userId || "guest_user";

  try {
    const jobs = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.postedBy, activeUserId))
      .orderBy(desc(jobsTable.postedAt));

    return jobs;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function deleteJob(id: string) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const result = await db
      .delete(jobsTable)
      .where(and(eq(jobsTable.id, id), eq(jobsTable.postedBy, userId)));

    if (result.rowCount === 0) {
      return {
        success: false,
        error: "Job not found or you lack permission to delete it.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { sucess: false, error: "Failed to delete the job." };
  }
}

export async function updateJob(id: string, jobData: JobFormData) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const validation = jobFormSchema.safeParse(jobData);
  if (!validation.success) {
    return { success: false, error: "Invalid form data provided" };
  }

  try {
    const result = await db
      .update(jobsTable)
      .set({
        title: validation.data.title,
        jobType: validation.data.jobType,
        location: validation.data.location,
        experienceLevel: validation.data.experienceLevel,
        salary: validation.data.salary,
        department: validation.data.department,
        workMode: validation.data.workMode,
        responsibilities: validation.data.responsibilities,
        requiredSkills: validation.data.requiredSkills,
        preferredSkills: validation.data.preferredSkills,
        minExperience: validation.data.minExperience,
        maxExperience: validation.data.maxExperience,
        industryExperience: validation.data.industryExperience,
        compensationType: validation.data.compensationType,
        minEducation: validation.data.minEducation,
        certifications: validation.data.certifications,
        toolsAndTechnologies: validation.data.toolsAndTechnologies,
        interviewRounds: validation.data.interviewRounds,
        interviewMode: validation.data.interviewMode,
        deadline: validation.data.deadline,
        openPositions: validation.data.openPositions,
        joiningDate: validation.data.joiningDate,
        perksAndBenefits: validation.data.perksAndBenefits,
        specialInstructions: validation.data.specialInstructions,
        selectionProcess: validation.data.selectionProcess,
        description: validation.data.description,
        applicationUrl: validation.data.applicationUrl,
      })
      .where(and(eq(jobsTable.id, id), eq(jobsTable.postedBy, userId)));

    if (result.rowCount === 0) {
      return {
        success: false,
        error: "Job not found or you lack permission to edit it.",
      };
    }

    revalidatePath("/");
    revalidatePath("/admin/jobs");
    revalidatePath("/company/jobs");
    revalidatePath(`/jobs/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update job:", error);
    return { success: false, error: "Failed to update the job" };
  }
}
