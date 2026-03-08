"use server";
import { db } from "@/lib/db";
import { userProfilesTable, companiesTable } from "@/lib/schema";
import { userProfileSchema } from "@/lib/validators";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
    const [company] = await db.select().from(companiesTable).where(eq(companiesTable.userId, userId)).limit(1);
    return company || null;
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
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
