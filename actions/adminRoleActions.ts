"use server";

import { db } from "@/lib/db";
import { adminRolesTable } from "@/lib/schema";
import { adminRoleSchema, AdminRoleFormValues } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/** Return all admin role records. */
export async function getAdminRoles() {
  try {
    const roles = await db
      .select()
      .from(adminRolesTable)
      .orderBy(adminRolesTable.createdAt);

    return roles;
  } catch (error) {
    console.error("Failed to fetch admin roles:", error);
    return [];
  }
}

/** Create or update an admin role for a given Clerk userId. */
export async function upsertAdminRole(data: AdminRoleFormValues) {
  const { userId: currentUserId } = await auth();
  if (!currentUserId) return { success: false, error: "Unauthorized" };

  const validation = adminRoleSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: "Invalid role data" };
  }

  const { userId, ...rest } = validation.data;

  try {
    const [existing] = await db
      .select()
      .from(adminRolesTable)
      .where(eq(adminRolesTable.userId, userId))
      .limit(1);

    if (existing) {
      await db
        .update(adminRolesTable)
        .set(rest)
        .where(eq(adminRolesTable.userId, userId));
    } else {
      await db.insert(adminRolesTable).values({ userId, ...rest });
    }

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to upsert admin role:", error);
    return { success: false, error: "Failed to save admin role" };
  }
}

/** Delete an admin role by its id. */
export async function deleteAdminRole(id: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    await db.delete(adminRolesTable).where(eq(adminRolesTable.id, id));
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete admin role:", error);
    return { success: false, error: "Failed to delete admin role" };
  }
}
