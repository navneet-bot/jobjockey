"use server";
import { db } from "@/lib/db";
import { userProfilesTable } from "@/lib/schema";
import { userProfileSchema } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";
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
        }
        revalidatePath("/profile");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
