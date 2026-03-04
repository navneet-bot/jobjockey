"use client";

import { useEffect, useState } from "react";
import { getCompanyApplications, updateApplicationStatus } from "@/actions/applicationActions";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { FileText, Building2, User } from "lucide-react";
import Link from "next/link";

type AppView = {
    application: any;
    job: any;
    profile: any;
};

export default function CompanyApplicationsPage() {
    const [apps, setApps] = useState<AppView[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadData() {
        setLoading(true);
        const data = await getCompanyApplications();
        setApps(data as AppView[]);
        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        const res = await updateApplicationStatus(id, newStatus as any);
        if (res.success) {
            toast.success(`Application status updated to ${newStatus}.`);
            loadData();
        } else {
            toast.error(res.error || "Failed to update status.");
        }
    };

    return (
        <div className="flex flex-col gap-10">
            <GradientHeader
                align="left"
                title="Job Applications"
                subtitle="Review candidates who have applied to your active job listings."
            />

            <GlassCard className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[var(--glass-bg)] border-b border-[var(--glass-border)] text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-medium">Candidate</th>
                                <th className="px-6 py-4 font-medium">Applied Position</th>
                                <th className="px-6 py-4 font-medium">Resume</th>
                                <th className="px-6 py-4 font-medium">Applied At</th>
                                <th className="px-6 py-4 font-medium">Status Update</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--glass-border)] text-[var(--text-main)]">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-10 text-center"><div className="inline-block w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div></td></tr>
                            ) : apps.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
                                            <div className="w-16 h-16 rounded-full bg-[var(--glass-bg)] flex items-center justify-center border border-[var(--glass-border)]">
                                                <User className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <p className="text-muted-foreground font-medium text-lg">
                                                No candidates shortlisted yet
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Admin has not shortlisted any candidates yet. You will see candidates here once the shortlisting is complete.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                apps.map(({ application, job, profile }) => (
                                    <tr key={application.id} className="hover:bg-[var(--glass-bg)] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-[var(--glass-border)] flex items-center justify-center border border-black/10 dark:border-white/5 shadow-inner">
                                                    <User className="w-4 h-4 text-muted-foreground dark:text-white" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-base">{profile?.name || "Unknown"}</span>
                                                    <span className="text-xs text-muted-foreground">{profile?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/jobs/${job.id}`} className="hover:text-[var(--primary)] font-medium inline-flex items-center gap-2 transition-colors">
                                                {job.title}
                                            </Link>
                                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                                <Building2 className="w-3 h-3" /> {job.company}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {application.resumeUrl ? (
                                                <a href={application.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[var(--text-main)] hover:text-[var(--primary)] dark:text-[var(--primary)] dark:hover:brightness-110 hover:underline transition-colors bg-black/5 dark:bg-white/10 px-3 py-1.5 rounded-full text-xs border border-black/5 dark:border-white/5">
                                                    <FileText className="w-3 h-3" /> View PDF
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground italic text-xs">Not provided</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {formatDistanceToNow(new Date(application.appliedAt))} ago
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <select
                                                    value={application.status}
                                                    onChange={(e) => handleStatusChange(application.id, e.target.value)}
                                                    className="bg-[var(--glass-bg)] border border-[var(--glass-border)] text-xs rounded-lg focus:ring-[var(--primary)] focus:border-[var(--primary)] block w-full p-2 text-[var(--text-main)]"
                                                >
                                                    <option value="waiting">Waiting</option>
                                                    <option value="interview">Interview</option>
                                                    <option value="selected">Selected</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>

                                                <div className="flex justify-center">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${application.status === "shortlisted" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" :
                                                        application.status === "interview" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" :
                                                            application.status === "waiting" ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20" :
                                                                application.status === "selected" ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" :
                                                                    "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                                                        }`}>
                                                        {application.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div >
            </GlassCard >
        </div >
    );
}
