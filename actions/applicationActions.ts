"use server";
import { db } from "@/lib/db";
import { applicationsTable, companyEnquiriesTable, internshipsTable, jobsTable, userProfilesTable } from "@/lib/schema";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { eq, desc, and, ne, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notificationActions";
import { sendEmail } from "@/lib/email";
import {
    applicationReceivedTemplate,
    newApplicantTemplate,
    shortlistedTemplate,
    rejectedTemplate,
    interviewInviteTemplate,
} from "@/lib/emailTemplates";

export async function checkApplicationStatus(id: string, category: "job" | "internship") {
    const { userId } = await auth();
    if (!userId) return false;

    try {
        const whereClause = category === "job" 
            ? and(eq(applicationsTable.jobId, id), eq(applicationsTable.userId, userId))
            : and(eq(applicationsTable.internshipId, id), eq(applicationsTable.userId, userId));

        const [existing] = await db.select().from(applicationsTable)
            .where(whereClause).limit(1);

        return !!existing;
    } catch (err) {
        console.error("Failed to check application status:", err);
        return false;
    }
}

export async function applyForJob(id: string, category: "job" | "internship", resumeUrl?: string) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const whereClause = category === "job" 
            ? and(eq(applicationsTable.jobId, id), eq(applicationsTable.userId, userId))
            : and(eq(applicationsTable.internshipId, id), eq(applicationsTable.userId, userId));

        const [existing] = await db.select().from(applicationsTable)
            .where(whereClause).limit(1);

        if (existing) return { success: false, error: "Already applied for this position." };

        await db.insert(applicationsTable).values({
            jobId: category === "job" ? id : null,
            internshipId: category === "internship" ? id : null,
            userId,
            resumeUrl
        });

        // Sync resume to user profile for future use
        if (resumeUrl) {
            await db.update(userProfilesTable)
                .set({ resumeUrl })
                .where(eq(userProfilesTable.userId, userId));
            revalidatePath("/profile");
        }

        revalidatePath(category === "job" ? `/jobs/${id}` : `/internships/${id}`);
        revalidatePath("/applications");

        // Notify Business
        const [targetPos] = category === "job" 
            ? await db.select({ title: jobsTable.title, postedBy: jobsTable.postedBy, company: jobsTable.company }).from(jobsTable).where(eq(jobsTable.id, id)).limit(1)
            : await db.select({ title: internshipsTable.title, postedBy: internshipsTable.postedBy, company: internshipsTable.company }).from(internshipsTable).where(eq(internshipsTable.id, id)).limit(1);

        if (targetPos) {
            const user = await currentUser();
            const role = user?.publicMetadata?.role as string | undefined;

            await createNotification({
                userId: targetPos.postedBy,
                title: "New Application Received",
                message: `A new candidate has applied for your ${category}: ${targetPos.title}`,
                type: "application_received",
                link: role === "admin" ? "/admin/applications" : "/business/dashboard"
            });

            // -- Email: notify candidate their application was received --
            const [candidateProfile] = await db
                .select({ name: userProfilesTable.name, email: userProfilesTable.email })
                .from(userProfilesTable)
                .where(eq(userProfilesTable.userId, userId))
                .limit(1);

            if (candidateProfile?.email) {
                await sendEmail({
                    to: candidateProfile.email,
                    subject: "Application Received - JobJockey",
                    html: applicationReceivedTemplate({
                        name: candidateProfile.name,
                        jobTitle: targetPos.title,
                        companyName: targetPos.company,
                    }),
                });
            }

            // -- Email: notify company/employer about new applicant --
            const [companyEnquiry] = await db
                .select({ email: companyEnquiriesTable.email, contactPerson: companyEnquiriesTable.contactPerson })
                .from(companyEnquiriesTable)
                .where(eq(companyEnquiriesTable.userId, targetPos.postedBy))
                .limit(1);

            if (companyEnquiry?.email) {
                await sendEmail({
                    to: companyEnquiry.email,
                    subject: `New Applicant for ${targetPos.title} - JobJockey`,
                    html: newApplicantTemplate({
                        jobTitle: targetPos.title,
                        companyName: targetPos.company,
                        dashboardLink: "https://jobjockey.in/business/dashboard",
                    }),
                });
            }
        }

        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function getMyApplications() {
    const { userId } = await auth();
    if (!userId) return [];

    const applications = await db.select({
        application: applicationsTable,
        job: jobsTable,
        internship: internshipsTable
    })
        .from(applicationsTable)
        .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
        .leftJoin(internshipsTable, eq(applicationsTable.internshipId, internshipsTable.id))
        .where(eq(applicationsTable.userId, userId))
        .orderBy(desc(applicationsTable.appliedAt));

    return applications;
}

export async function getAllApplications() {
    const { userId } = await auth();
    if (!userId) return [];

    const data = await db.select({
        application: applicationsTable,
        job: jobsTable,
        internship: internshipsTable,
        profile: userProfilesTable
    })
        .from(applicationsTable)
        .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
        .leftJoin(internshipsTable, eq(applicationsTable.internshipId, internshipsTable.id))
        .leftJoin(userProfilesTable, eq(applicationsTable.userId, userProfilesTable.userId))
        .orderBy(desc(applicationsTable.appliedAt));

    const client = await clerkClient();
    return await Promise.all(data.map(async (row) => {
        let name = row.profile?.name;
        let email = row.profile?.email;

        if (!name || !email) {
            try {
                const clerkUser = await client.users.getUser(row.application.userId);
                name = name || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Unknown';
                email = email || clerkUser.emailAddresses[0]?.emailAddress || 'Unknown';
            } catch (e) {
                console.error("Failed to fetch Clerk user", e);
            }
        }

        return {
            ...row,
            profile: {
                ...row.profile,
                name: name || 'Unknown',
                email: email || 'Unknown'
            }
        };
    }));
}

export async function getCompanyApplications() {
    const user = await currentUser();
    if (!user) return [];

    const role = user.publicMetadata?.role as string | undefined;
    const userId = user.id;

    const data = await db.select({
        application: applicationsTable,
        job: jobsTable,
        internship: internshipsTable,
        profile: userProfilesTable
    })
        .from(applicationsTable)
        .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
        .leftJoin(internshipsTable, eq(applicationsTable.internshipId, internshipsTable.id))
        .leftJoin(userProfilesTable, eq(applicationsTable.userId, userProfilesTable.userId))
        .where(
            role === "admin"
                ? undefined
                : and(
                    or(eq(jobsTable.postedBy, userId), eq(internshipsTable.postedBy, userId)),
                    ne(applicationsTable.status, "pending")
                  )
        )
        .orderBy(desc(applicationsTable.appliedAt));

    const client = await clerkClient();
    return await Promise.all(data.map(async (row) => {
        let name = row.profile?.name;
        let email = row.profile?.email;
        let phone = row.profile?.phone;

        // Admin, Company (for non-pending), or other: fetch full details
        if (!name || !email) {
            try {
                const clerkUser = await client.users.getUser(row.application.userId);
                name = name || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Unknown';
                email = email || clerkUser.emailAddresses[0]?.emailAddress || 'Unknown';
                phone = phone || clerkUser.phoneNumbers[0]?.phoneNumber || 'Unknown';
            } catch (e) {
                console.error("Failed to fetch Clerk user", e);
            }
        }

        return {
            ...row,
            profile: {
                ...row.profile,
                name: name || 'Unknown',
                email: email || 'Unknown',
                phone: phone
            }
        };
    }));
}

export async function getJobApplications(jobId: string) {
    const user = await currentUser();
    if (!user || user.publicMetadata?.role !== "admin") return [];

    const data = await db.select({
        application: applicationsTable,
        job: jobsTable,
        profile: userProfilesTable
    })
        .from(applicationsTable)
        .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
        .leftJoin(userProfilesTable, eq(applicationsTable.userId, userProfilesTable.userId))
        .where(eq(applicationsTable.jobId, jobId))
        .orderBy(desc(applicationsTable.appliedAt));

    const client = await clerkClient();
    return await Promise.all(data.map(async (row) => {
        let name = row.profile?.name;
        let email = row.profile?.email;

        if (!name || !email) {
            try {
                const clerkUser = await client.users.getUser(row.application.userId);
                name = name || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Unknown';
                email = email || clerkUser.emailAddresses[0]?.emailAddress || 'Unknown';
            } catch (e) {
                console.error("Failed to fetch Clerk user", e);
            }
        }

        return {
            ...row,
            profile: {
                ...row.profile,
                name: name || 'Unknown',
                email: email || 'Unknown'
            }
        };
    }));
}

export async function getCompanyJobsForAdmin(companyId: string) {
    const user = await currentUser();
    if (!user || user.publicMetadata?.role !== "admin") return [];

    return await db.select({
        id: jobsTable.id,
        title: jobsTable.title,
        jobType: jobsTable.jobType,
        postedAt: jobsTable.postedAt,
        applicationCount: db.$count(applicationsTable, eq(applicationsTable.jobId, jobsTable.id))
    })
        .from(jobsTable)
        .where(eq(jobsTable.companyId, companyId))
        .orderBy(desc(jobsTable.postedAt));
}

export async function getGlobalApplicantsForAdmin() {
    const user = await currentUser();
    if (!user || user.publicMetadata?.role !== "admin") return [];

    try {
        const data = await db.select({
            application: applicationsTable,
            job: jobsTable,
            internship: internshipsTable,
            profile: userProfilesTable,
            company: companyEnquiriesTable
        })
            .from(applicationsTable)
            .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
            .leftJoin(internshipsTable, eq(applicationsTable.internshipId, internshipsTable.id))
            .leftJoin(userProfilesTable, eq(applicationsTable.userId, userProfilesTable.userId))
            .leftJoin(companyEnquiriesTable, sql`${companyEnquiriesTable.id} = COALESCE(${jobsTable.companyId}, ${internshipsTable.companyId})`)
            .orderBy(desc(applicationsTable.appliedAt));

        const client = await clerkClient();
        return await Promise.all(data.map(async (row) => {
            let name = row.profile?.name;
            let email = row.profile?.email;

            if (!name || !email) {
                try {
                    const clerkUser = await client.users.getUser(row.application.userId);
                    name = name || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Unknown';
                    email = email || clerkUser.emailAddresses[0]?.emailAddress || 'Unknown';
                } catch (e) {
                    // console.error("Failed to fetch Clerk user", e);
                }
            }

            return {
                id: row.application.id,
                candidateName: name || 'Unknown',
                email: email || 'Unknown',
                jobTitle: row.job?.title || row.internship?.title || 'Unknown Position',
                companyName: row.company?.companyName || row.job?.company || row.internship?.company || 'Unknown Company',
                companyDomain: row.company?.companyUrl || '',
                category: row.job ? 'JOB' : 'INTERNSHIP',
                resumeUrl: row.application.resumeUrl,
                status: row.application.status,
                appliedAt: row.application.appliedAt
            };
        }));
    } catch (err) {
        console.error("Failed to fetch global applicants:", err);
        return [];
    }
}

export async function updateApplicationStatus(id: string, status: "pending" | "shortlisted" | "interview" | "selected" | "rejected") {
    const user = await currentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const role = user.publicMetadata?.role as string | undefined;
    const userId = user.id;

    try {
        // Fetch current application to verify transition
        const [app] = await db.select({
            status: applicationsTable.status,
            postedBy: jobsTable.postedBy,
            internshipPostedBy: internshipsTable.postedBy
        })
            .from(applicationsTable)
            .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
            .leftJoin(internshipsTable, eq(applicationsTable.internshipId, internshipsTable.id))
            .where(eq(applicationsTable.id, id))
            .limit(1);

        if (!app) return { success: false, error: "Application not found" };

        const postedBy = app.postedBy || app.internshipPostedBy;

        // Security Rules:
        // 1. Admin can change any status to shortlisted or rejected
        // 2. Employer can only change FROM shortlisted TO selected or rejected

        if (role === "admin") {
            // Admin logic: Can only shortlist or reject
            if (status !== "shortlisted" && status !== "rejected") {
                return { success: false, error: "Admin can only shortlist or reject applications." };
            }
            await db.update(applicationsTable).set({ status }).where(eq(applicationsTable.id, id));
        } else if (role === "company") {
            // Company logic
            if (postedBy !== userId) return { success: false, error: "Unauthorized to update this application" };

            // Company cannot process candidates still in "pending" status (must be shortlisted by Admin)
            if (app.status === "pending") return { success: false, error: "You can only process candidates shortlisted by the Admin." };

            // Allow transitions to any valid employer-led status
            const validCompanyStatuses = ["shortlisted", "interview", "waiting", "selected", "rejected"];
            if (!validCompanyStatuses.includes(status)) {
                return { success: false, error: "Invalid status transition for Employer" };
            }

            await db.update(applicationsTable).set({ status }).where(eq(applicationsTable.id, id));

            // Notify Talent
            const [application] = await db.select({ 
                userId: applicationsTable.userId,
                jobId: applicationsTable.jobId,
                internshipId: applicationsTable.internshipId
            }).from(applicationsTable).where(eq(applicationsTable.id, id)).limit(1);

            if (application) {
                const [pos] = application.jobId
                    ? await db.select({ title: jobsTable.title, company: jobsTable.company }).from(jobsTable).where(eq(jobsTable.id, application.jobId)).limit(1)
                    : application.internshipId 
                        ? await db.select({ title: internshipsTable.title, company: internshipsTable.company }).from(internshipsTable).where(eq(internshipsTable.id, application.internshipId)).limit(1)
                        : [];

                await createNotification({
                    userId: application.userId,
                    title: "Application Status Updated",
                    message: `Your application for "${pos?.title || 'Position'}" has been updated to ${status}.`,
                    type: "application_status_updated",
                    link: "/applications"
                });

                // -- Email: send status-specific email to candidate --
                const [candidateProfile] = await db
                    .select({ name: userProfilesTable.name, email: userProfilesTable.email })
                    .from(userProfilesTable)
                    .where(eq(userProfilesTable.userId, application.userId))
                    .limit(1);

                if (candidateProfile?.email) {
                    const emailParams = {
                        name: candidateProfile.name,
                        jobTitle: pos?.title || "the position",
                        companyName: pos && "company" in pos ? pos.company : "the company",
                    };

                    if (status === "shortlisted") {
                        await sendEmail({
                            to: candidateProfile.email,
                            subject: "You are Shortlisted! 🎉 - JobJockey",
                            html: shortlistedTemplate(emailParams),
                        });
                    } else if (status === "rejected") {
                        await sendEmail({
                            to: candidateProfile.email,
                            subject: "Application Update - JobJockey",
                            html: rejectedTemplate(emailParams),
                        });
                    } else if (status === "interview" || status === "selected") {
                        await sendEmail({
                            to: candidateProfile.email,
                            subject: "Interview Invitation - JobJockey",
                            html: interviewInviteTemplate(emailParams),
                        });
                    }
                }
            }
        } else {
            return { success: false, error: "Insufficient permissions" };
        }

        revalidatePath("/admin/applications");
        revalidatePath("/company/applications");
        revalidatePath("/applications");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
