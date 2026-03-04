import { getJobs } from "@/actions/jobActions";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { GradientButton } from "@/components/ui/GradientButton";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { jobsTable } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { AdminJobTable } from "@/components/features/admin/AdminJobTable";

export default async function AdminJobsPage() {
    const { userId } = await auth();
    if (!userId) return null; // Secure

    // For Admin specifically we pull all jobs.
    const jobs = await db.select().from(jobsTable).orderBy(desc(jobsTable.postedAt));

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-end">
                <GradientHeader
                    align="left"
                    title="Manage Jobs"
                    subtitle="Oversee all listings across Jobs, Internships, and Training categories."
                />
                <Link href="/post-job" className="shrink-0">
                    <GradientButton>+ Post New Job</GradientButton>
                </Link>
            </div>

            <AdminJobTable jobs={jobs} />
        </div>
    );
}
