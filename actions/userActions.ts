"use server";
import { db } from "@/lib/db";
import { userProfilesTable, companiesTable, companyEnquiriesTable } from "@/lib/schema";
import { userProfileSchema } from "@/lib/validators";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq, desc, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notificationActions";

type ProfileFormData = {
    name: string;
    phone: string;
    email: string;
    linkedin?: string;
    github?: string;
    resumeUrl?: string;
};

export async function getUserProfile() {
    const { userId } = await auth();
    if (!userId) return null;
    const [profile] = await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, userId)).limit(1);
    return profile || null;
}

export async function upsertUserProfile(data: ProfileFormData) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const existing = await getUserProfile();
        if (existing) {
            await db.update(userProfilesTable).set(data).where(eq(userProfilesTable.userId, userId));
        } else {
            await db.insert(userProfilesTable).values({ ...data, userId });
            
            // Assign the talent role to the user's metadata so the UI immediately knows they have a profile
            const client = await clerkClient();
            await client.users.updateUserMetadata(userId, {
                publicMetadata: {
                    role: "talent"
                }
            });
        }
        revalidatePath("/");
        revalidatePath("/profile");

        await createNotification({
            userId,
            title: "Profile Updated",
            message: data.resumeUrl ? "Your profile and resume have been updated successfully." : "Your profile has been updated successfully.",
            type: "profile_updated",
            link: "/talent/dashboard"
        });

        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export type CompanyProfileData = {
    companyName: string;
    industry: string;
    companyWebsite: string;
    description: string;
    contactPerson?: string;
    designation?: string;
    email?: string;
    phone?: string;
    companySize?: string;
    gstNumber?: string;
    hiringNeeds?: string;
};

export async function getCompanyProfile() {
    const { userId } = await auth();
    if (!userId) return null;

    // 1. Try to get the existing profile
    const [company] = await db.select().from(companiesTable).where(eq(companiesTable.userId, userId)).limit(1);
    if (company) return company;

    // 2. Fallback: Check for a matching Business Enquiry to auto-fill details
    const [enquiry] = await db.select()
        .from(companyEnquiriesTable)
        .where(eq(companyEnquiriesTable.userId, userId))
        .orderBy(desc(companyEnquiriesTable.submittedAt))
        .limit(1);

    if (enquiry) {
        return {
            companyName: enquiry.companyName,
            industry: enquiry.industry,
            companyWebsite: enquiry.companyUrl,
            description: enquiry.message || enquiry.hiringNeeds, // Use message or hiring needs as a starting description
            contactPerson: enquiry.contactPerson,
            designation: enquiry.designation,
            email: enquiry.email,
            phone: enquiry.phone,
            companySize: enquiry.companySize,
            gstNumber: enquiry.gstNumber,
            hiringNeeds: enquiry.hiringNeeds,
            isVerified: false,
            userId: userId
        };
    }

    return null;
}

export async function updateCompanyProfile(data: CompanyProfileData) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const existing = await getCompanyProfile();
        if (existing) {
            await db.update(companiesTable).set({
                ...data
            }).where(eq(companiesTable.userId, userId));
        } else {
            await db.insert(companiesTable).values({
                userId,
                ...data,
                isVerified: false,
            });
        }
        revalidatePath("/business/dashboard");

        await createNotification({
            userId,
            title: "Business Profile Updated",
            message: "Your company profile settings have been saved successfully.",
            type: "profile_updated",
            link: "/business/dashboard"
        });

        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
