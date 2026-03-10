import { getJobs } from "@/actions/jobActions";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { GradientButton } from "@/components/ui/GradientButton";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { jobsTable, internshipsTable } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { AdminJobTable } from "@/components/features/admin/AdminJobTable";

export default async function AdminJobsPage() {
    const { userId } = await auth();
    if (!userId) return null; // Secure

    // For Admin specifically we pull all jobs and internships.
    const [jobs, internships] = await Promise.all([
        db.select().from(jobsTable).orderBy(desc(jobsTable.postedAt)),
        db.select().from(internshipsTable).orderBy(desc(internshipsTable.postedAt))
    ]);

    // Combine and add category for the table
    const combined = [
        ...jobs.map(j => ({ ...j, jobCategory: "job" as const })),
        ...internships.map(i => ({ ...i, jobCategory: "internship" as const }))
    ].sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-end mb-4">
                <GradientHeader
                    align="left"
                    title="Manage Jobs"
                    subtitle="Oversee all listings across Jobs, Internships, and Training categories."
                />
            </div>

            <AdminJobTable jobs={combined} />
        </div>
    );
}
