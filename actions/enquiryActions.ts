"use server";
import { db } from "@/lib/db";
import { companyEnquiriesTable } from "@/lib/schema";
import { companyEnquirySchema, CompanyEnquiryFormValues } from "@/lib/validators";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function submitCompanyEnquiry(data: CompanyEnquiryFormValues) {
    const validation = companyEnquirySchema.safeParse(data);
    if (!validation.success) return { success: false, error: "Invalid data" };

    const { userId } = await auth();

    try {
        const [existing] = await db.select().from(companyEnquiriesTable)
            .where(eq(companyEnquiriesTable.email, validation.data.email)).limit(1);

        if (existing && existing.status !== "rejected") {
            return { success: false, error: "An enquiry is already pending or approved for this email." };
        }

        if (existing && existing.status === "rejected") {
            await db.update(companyEnquiriesTable).set({ ...validation.data, userId, status: "pending" }).where(eq(companyEnquiriesTable.id, existing.id));
        } else {
            await db.insert(companyEnquiriesTable).values({ ...validation.data, userId });
        }

        revalidatePath("/enquiry");
        revalidatePath("/admin/companies");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getCompanyEnquiries(status?: "pending" | "approved" | "rejected") {
    const query = db.select().from(companyEnquiriesTable);
    if (status) {
        query.where(eq(companyEnquiriesTable.status, status));
    }
    return await query.orderBy(desc(companyEnquiriesTable.submittedAt));
}

export async function updateEnquiryStatus(id: string, status: "approved" | "rejected") {
    try {
        const [updated] = await db.update(companyEnquiriesTable)
            .set({ status })
            .where(eq(companyEnquiriesTable.id, id))
            .returning();

        if (status === "approved" && updated) {
            let targetUserId = updated.userId;

            const client = await clerkClient();

            // Fallback to searching by email if standard userId isn't tracked yet
            if (!targetUserId) {
                const users = await client.users.getUserList({ emailAddress: [updated.email] });
                if (users.data.length > 0) {
                    targetUserId = users.data[0].id;
                }
            }

            if (targetUserId) {
                await client.users.updateUserMetadata(targetUserId, {
                    publicMetadata: {
                        role: "company"
                    }
                });
            }
        }

        revalidatePath("/admin/companies");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
