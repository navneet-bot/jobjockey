import { DashboardStat } from "@/components/ui/DashboardStat";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { companyEnquiriesTable, jobsTable, internshipsTable, applicationsTable } from "@/lib/schema";
import { count, eq } from "drizzle-orm";
import { Building, Briefcase, FileText, GraduationCap } from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {

    // Fetch some quick stats
    const [[companies], [jobs], [internships], [applications]] = await Promise.all([
        db.select({ value: count() }).from(companyEnquiriesTable).where(eq(companyEnquiriesTable.status, "pending")),
        db.select({ value: count() }).from(jobsTable).where(eq(jobsTable.isApproved, true)),
        db.select({ value: count() }).from(internshipsTable).where(eq(internshipsTable.isApproved, true)),
        db.select({ value: count() }).from(applicationsTable).where(eq(applicationsTable.status, "pending"))
    ]);

    return (
        <div className="flex flex-col gap-10">
            <GradientHeader
                align="left"
                title="Admin Dashboard"
                subtitle="Manage the platform's companies, job postings, and user applications."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStat
                    title="Pending Companies"
                    value={companies.value}
                    icon={<Building className="w-7 h-7" />}
                    href="/admin/enquiries"
                />
                <DashboardStat
                    title="Active Jobs"
                    value={jobs.value}
                    icon={<Briefcase className="w-7 h-7" />}
                    href="/admin/jobs"
                />
                <DashboardStat
                    title="Active Internships"
                    value={internships.value}
                    icon={<GraduationCap className="w-7 h-7" />}
                    href="/admin/internships"
                />
                <DashboardStat
                    title="Pending Applications"
                    value={applications.value}
                    icon={<FileText className="w-7 h-7" />}
                    href="/admin/applications"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                {/* Placeholder for future charts or recent activity logs in GlassCards */}
                <GlassCard className="h-64 flex items-center justify-center text-muted-foreground border-dashed">
                    Recent Activity Feed goes here...
                </GlassCard>
                <GlassCard className="h-64 flex items-center justify-center text-muted-foreground border-dashed">
                    Analytics Chart goes here...
                </GlassCard>
            </div>
        </div>
    );
}
