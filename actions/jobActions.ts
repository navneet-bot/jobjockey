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
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship";
  jobCategory: "job" | "internship" | "training";
  location: string;
  experienceLevel: "Entry Level" | "Mid-Level" | "Senior" | "Manager";
  salary?: string;
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

    // 2. Insert job with auto-populated company details
    await db.insert(jobsTable).values({
      ...validation.data,
      companyId: enquiry.id,
      company: enquiry.companyName,
      postedBy: userId,
      isApproved: true, // Assuming company-posted jobs are pre-approved once company is verified
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
        jobCategory: validation.data.jobCategory,
        location: validation.data.location,
        experienceLevel: validation.data.experienceLevel,
        salary: validation.data.salary,
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
