import { getMyJobs } from "@/actions/jobActions";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { Briefcase, Activity, CheckCircle } from "lucide-react";

export default async function CompanyDashboardPage() {
    const jobs = await getMyJobs();
    const activeJobs = jobs.filter(j => j.isApproved).length;
    const pendingJobs = jobs.length - activeJobs;

    return (
        <div className="flex flex-col gap-10">
            <GradientHeader
                align="left"
                title="Employer Dashboard"
                subtitle="Manage your active listings and track incoming candidate applications."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-black dark:text-[var(--primary)]" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Listings</p>
                        <p className="text-2xl font-bold text-[var(--text-main)] mt-1">{jobs.length}</p>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-700 dark:text-green-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                        <p className="text-2xl font-bold text-[var(--text-main)] mt-1">{activeJobs}</p>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-[var(--glass-border)] border border-black/10 dark:border-[rgba(255,255,255,0.05)] flex items-center justify-center">
                        <Activity className="w-6 h-6 text-black dark:text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                        <p className="text-2xl font-bold text-[var(--text-main)] mt-1">{pendingJobs}</p>
                    </div>
                </GlassCard>
            </div>

        </div>
    );
}
