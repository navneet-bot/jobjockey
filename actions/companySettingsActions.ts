"use server";

import { db } from "@/lib/db";
import {
  companySettingsTable,
  companyEnquiriesTable,
} from "@/lib/schema";
import {
  companySettingsSchema,
  CompanySettingsFormValues,
} from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/** Fetch all approved companies for use in the settings dropdown. */
export async function getApprovedCompanies() {
  try {
    const companies = await db
      .select({
        id: companyEnquiriesTable.id,
        companyName: companyEnquiriesTable.companyName,
        userId: companyEnquiriesTable.userId,
      })
      .from(companyEnquiriesTable)
      .where(eq(companyEnquiriesTable.status, "approved"));

    return companies;
  } catch (error) {
    console.error("Failed to fetch approved companies:", error);
    return [];
  }
}

/** Fetch restriction settings for a specific company. Returns null when none exist (fall back to global). */
export async function getCompanySettings(companyId: string) {
  try {
    const [settings] = await db
      .select()
      .from(companySettingsTable)
      .where(eq(companySettingsTable.companyId, companyId))
      .limit(1);

    return settings ?? null;
  } catch (error) {
    console.error("Failed to fetch company settings:", error);
    return null;
  }
}

/** Create or update restriction settings for a given company. */
export async function upsertCompanySettings(data: CompanySettingsFormValues) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const validation = companySettingsSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: "Invalid settings data" };
  }

  const { companyId, ...rest } = validation.data;

  try {
    const [existing] = await db
      .select()
      .from(companySettingsTable)
      .where(eq(companySettingsTable.companyId, companyId))
      .limit(1);

    if (existing) {
      await db
        .update(companySettingsTable)
        .set({ ...rest, updatedAt: new Date() })
        .where(eq(companySettingsTable.companyId, companyId));
    } else {
      await db.insert(companySettingsTable).values({ companyId, ...rest });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/admin/companies");
    return { success: true };
  } catch (error) {
    console.error("Failed to upsert company settings:", error);
    return { success: false, error: "Failed to save company settings" };
  }
}
