"use server";

import { db } from "@/lib/db";
import { jobsTable, applicationsTable, internshipsTable } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, ne, count, or } from "drizzle-orm";

export async function getBusinessDashboardStats() {
    const { userId } = await auth();
    if (!userId) return { activeJobs: 0, totalApplications: 0, shortlisted: 0 };

    try {
        const [activeJobsQuery, activeInternshipsQuery] = await Promise.all([
            db.select({ count: count() })
                .from(jobsTable)
                .where(eq(jobsTable.postedBy, userId)),
            db.select({ count: count() })
                .from(internshipsTable)
                .where(eq(internshipsTable.postedBy, userId))
        ]);
        
        const activeJobs = (activeJobsQuery[0]?.count || 0) + (activeInternshipsQuery[0]?.count || 0);

        const appsQuery = await db.select({
                status: applicationsTable.status
            })
            .from(applicationsTable)
            .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
            .leftJoin(internshipsTable, eq(applicationsTable.internshipId, internshipsTable.id))
            .where(
                and(
                    or(eq(jobsTable.postedBy, userId), eq(internshipsTable.postedBy, userId)),
                    ne(applicationsTable.status, "pending")
                )
            );

        const totalApplications = appsQuery.length;
        const shortlisted = appsQuery.filter(a => ["shortlisted", "interview", "waiting", "selected"].includes(a.status)).length;

        return { activeJobs, totalApplications, shortlisted };
    } catch (err) {
        console.error("Error fetching stats:", err);
        return { activeJobs: 0, totalApplications: 0, shortlisted: 0 };
    }
}
