import { GradientHeader } from "@/components/ui/GradientHeader";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { internshipsTable } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { AdminJobTable } from "@/components/features/admin/AdminJobTable";

export default async function AdminInternshipsPage() {
    const { userId } = await auth();
    if (!userId) return null; // Secure

    // For Admin specifically we pull only internships.
    const internships = await db.select().from(internshipsTable).orderBy(desc(internshipsTable.postedAt));

    // Add category for the table
    const internshipList = internships.map(i => ({ ...i, jobCategory: "internship" as const }));

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-end mb-4">
                <GradientHeader
                    align="left"
                    title="Manage Internships"
                    subtitle="Oversee and manage all active internship postings."
                />
            </div>

            <AdminJobTable jobs={internshipList} />
        </div>
    );
}
