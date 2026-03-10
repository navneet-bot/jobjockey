"use server";

import { db } from "@/lib/db";
import { platformSettingsTable, NewPlatformSetting } from "@/lib/schema";
import { platformSettingsSchema, PlatformSettingsFormValues } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPlatformSettings() {
  try {
    const [settings] = await db.select().from(platformSettingsTable).limit(1);
    
    if (!settings) {
      // Initialize if not exists
      const [newSettings] = await db.insert(platformSettingsTable).values({}).returning();
      return newSettings;
    }
    
    return settings;
  } catch (error) {
    console.error("Failed to fetch platform settings:", error);
    return null;
  }
}

export async function updatePlatformSettings(data: PlatformSettingsFormValues) {
  const { userId } = await auth();
  // In a real app, you'd check if the user is an admin. 
  // For this implementation, we assume the route is protected by middleware/clerk.
  if (!userId) return { success: false, error: "Unauthorized" };

  const validation = platformSettingsSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: "Invalid settings data" };
  }

  try {
    const [existing] = await db.select().from(platformSettingsTable).limit(1);

    if (existing) {
      await db
        .update(platformSettingsTable)
        .set({
          ...validation.data,
          updatedAt: new Date(),
        })
        .where(eq(platformSettingsTable.id, existing.id));
    } else {
      await db.insert(platformSettingsTable).values(validation.data);
    }

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update platform settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
