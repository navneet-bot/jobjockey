"use server";
import { db } from "@/lib/db";
import { companyEnquiriesTable, companiesTable, jobsTable, internshipsTable } from "@/lib/schema";
import { companyEnquirySchema, CompanyEnquiryFormValues } from "@/lib/validators";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq, desc, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notificationActions";
import { sendEmail } from "@/lib/email";
import { companyApprovalTemplate } from "@/lib/emailTemplates";

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

        revalidatePath("/business/enquiry");
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
    const enquiries = await query.orderBy(desc(companyEnquiriesTable.submittedAt));

    // Enhance with job counts for approved companies
    const enhancedEnquiries = await Promise.all(enquiries.map(async (enq) => {
        if (enq.status !== "approved") return { ...enq, jobCount: 0 };

        const [jobRes] = await db.select({ count: count() })
            .from(jobsTable)
            .where(eq(jobsTable.companyId, enq.id));
        
        const [internRes] = await db.select({ count: count() })
            .from(internshipsTable)
            .where(eq(internshipsTable.companyId, enq.id));
        
        return {
            ...enq,
            jobCount: Number(jobRes.count) + Number(internRes.count)
        };
    }));

    return JSON.parse(JSON.stringify(enhancedEnquiries));
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

                // Check if company profile already exists
                const [existingCompany] = await db
                    .select()
                    .from(companiesTable)
                    .where(eq(companiesTable.userId, targetUserId))
                    .limit(1);

                if (!existingCompany) {
                    await db.insert(companiesTable).values({
                        userId: targetUserId,
                        companyName: updated.companyName,
                        industry: updated.industry,
                        designation: updated.designation,
                        companyWebsite: updated.companyUrl,
                        isVerified: true
                    });
                } else {
                    await db.update(companiesTable)
                        .set({ isVerified: true })
                        .where(eq(companiesTable.userId, targetUserId));
                }

                await createNotification({
                    userId: targetUserId,
                    title: "Company Approved",
                    message: `Welcome to findtalent! Your company enquiry for ${updated.companyName} has been approved.`,
                    type: "company_approved",
                    link: "/business/dashboard"
                });

                // -- Email: notify company of approval --
                if (updated.email) {
                    await sendEmail({
                        to: updated.email,
                        subject: "Your Company has been Approved on JobJockey!",
                        html: companyApprovalTemplate({
                            name: updated.contactPerson || "there",
                            companyName: updated.companyName || "your company",
                            dashboardLink: "https://jobjockey.in/business/dashboard",
                        }),
                    });
                }
            }
        } else if (status === "rejected" && updated) {
            if (updated.userId) {
                await createNotification({
                    userId: updated.userId,
                    title: "Enquiry Rejected",
                    message: `We regret to inform you that your enquiry for ${updated.companyName} was not approved at this time.`,
                    type: "company_rejected"
                });
            }
        }

        revalidatePath("/admin/companies");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function deleteCompanyAction(id: string) {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: "Unauthorized" };

        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        if (user.publicMetadata?.role !== "admin") {
            return { success: false, error: "Unauthorized: Admin access required" };
        }

        await db.delete(companyEnquiriesTable)
            .where(eq(companyEnquiriesTable.id, id));

        revalidatePath("/admin/companies");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
