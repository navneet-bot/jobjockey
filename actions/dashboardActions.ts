"use server";

import { db } from "@/lib/db";
import { jobsTable, applicationsTable } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, ne, count } from "drizzle-orm";

export async function getBusinessDashboardStats() {
    const { userId } = await auth();
    if (!userId) return { activeJobs: 0, totalApplications: 0, shortlisted: 0 };

    try {
        const activeJobsQuery = await db.select({ count: count() })
            .from(jobsTable)
            .where(eq(jobsTable.postedBy, userId));
        
        const activeJobs = activeJobsQuery[0]?.count || 0;

        const appsQuery = await db.select({
                status: applicationsTable.status
            })
            .from(applicationsTable)
            .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
            .where(and(eq(jobsTable.postedBy, userId), ne(applicationsTable.status, "pending")));

        const totalApplications = appsQuery.length;
        // Count anything that's past pending and not strictly rejected as "shortlisted/in-progress" conceptually,
        // but let's strictly count 'shortlisted' mapped items.
        const shortlisted = appsQuery.filter(a => ["shortlisted", "interview", "waiting", "selected"].includes(a.status)).length;

        return { activeJobs, totalApplications, shortlisted };
    } catch (err) {
        console.error("Error fetching stats:", err);
        return { activeJobs: 0, totalApplications: 0, shortlisted: 0 };
    }
}
