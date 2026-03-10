"use server";

import { db } from "@/lib/db";
import { internshipsTable, NewInternship, companyEnquiriesTable } from "@/lib/schema";
import { internshipFormSchema, InternshipFormValues } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { platformSettingsTable } from "@/lib/schema";
import { addDays } from "date-fns";

export async function getInternships() {
  try {
    const [settings] = await db.select().from(platformSettingsTable).limit(1);
    const showInternships = settings?.showInternshipsPublicly ?? true;

    if (!showInternships) return [];

    const internships = await db
      .select()
      .from(internshipsTable)
      .where(eq(internshipsTable.isExpired, false))
      .orderBy(desc(internshipsTable.postedAt));

    return internships;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getSingleInternship(id: string) {
  try {
    const [internship] = await db
      .select()
      .from(internshipsTable)
      .where(eq(internshipsTable.id, id))
      .limit(1);

    return internship ?? null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function createInternship(internshipData: InternshipFormValues) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const validation = internshipFormSchema.safeParse(internshipData);
  if (!validation.success) {
    return { success: false, error: "Invalid form data provided" };
  }

  try {
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
        error: "You cannot post internships until your company is verified by admin.",
      };
    }

    const { jobCategory, ...internshipDataRest } = validation.data;

    // 2. Fetch platform settings
    const [settings] = await db.select().from(platformSettingsTable).limit(1);
    const maxInternships = settings?.maxInternshipPostsPerCompany ?? 10;
    const defaultExpiryDays = settings?.internshipDefaultExpiryDays ?? 30;

    // 3. Check current internship count for this company
    const currentInternships = await db
      .select()
      .from(internshipsTable)
      .where(eq(internshipsTable.postedBy, userId));

    if (currentInternships.length >= maxInternships) {
      return {
        success: false,
        error: `Maximum internship posting limit reached (${maxInternships}). Please remove existing posts to add more.`,
      };
    }

    // 4. Calculate expiry date
    const expiryDate = addDays(new Date(), defaultExpiryDays);

    await db.insert(internshipsTable).values({
      ...internshipDataRest,
      companyId: enquiry.id,
      company: enquiry.companyName,
      postedBy: userId,
      isApproved: true,
      expiryDate,
    });

    revalidatePath("/");
    revalidatePath("/admin/internships");
    revalidatePath("/company/internships");
    return { success: true };
  } catch (error) {
    console.error("Failed to create internship:", error);
    return { success: false, error: "Failed to create the internship" };
  }
}

export async function getMyInternships() {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    const internships = await db
      .select()
      .from(internshipsTable)
      .where(eq(internshipsTable.postedBy, userId))
      .orderBy(desc(internshipsTable.postedAt));

    return internships;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function deleteInternship(id: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    const result = await db
      .delete(internshipsTable)
      .where(and(eq(internshipsTable.id, id), eq(internshipsTable.postedBy, userId)));

    if (result.rowCount === 0) {
      return {
        success: false,
        error: "Internship not found or you lack permission to delete it.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to delete the internship." };
  }
}

export async function updateInternship(id: string, internshipData: InternshipFormValues) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const validation = internshipFormSchema.safeParse(internshipData);
  if (!validation.success) {
    return { success: false, error: "Invalid form data provided" };
  }

  try {
    const result = await db
      .update(internshipsTable)
      .set({
        title: validation.data.title,
        location: validation.data.location,
        duration: validation.data.duration,
        stipend: validation.data.stipend,
        department: validation.data.department,
        workMode: validation.data.workMode,
        description: validation.data.description,
        whatWillLearn: validation.data.whatWillLearn,
        projectsAndTasks: validation.data.projectsAndTasks,
        requiredSkills: validation.data.requiredSkills,
        toolsAndTechnologies: validation.data.toolsAndTechnologies,
        educationLevel: validation.data.educationLevel,
        eligibleCourses: validation.data.eligibleCourses,
        mentorshipProvided: validation.data.mentorshipProvided,
        trainingProvided: validation.data.trainingProvided,
        certificateProvided: validation.data.certificateProvided,
        letterOfRecProvided: validation.data.letterOfRecProvided,
        ppoPossibility: validation.data.ppoPossibility,
        selectionProcess: validation.data.selectionProcess,
        openPositions: validation.data.openPositions,
        joiningDate: validation.data.joiningDate,
        deadline: validation.data.deadline,
        applicationUrl: validation.data.applicationUrl,
      })
      .where(and(eq(internshipsTable.id, id), eq(internshipsTable.postedBy, userId)));

    if (result.rowCount === 0) {
      return {
        success: false,
        error: "Internship not found or you lack permission to edit it.",
      };
    }

    revalidatePath("/");
    revalidatePath("/admin/internships");
    revalidatePath("/company/internships");
    revalidatePath(`/internships/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update internship:", error);
    return { success: false, error: "Failed to update the internship" };
  }
}
