"use client";

import { useEffect, useState } from "react";
import { getAllApplications, updateApplicationStatus } from "@/actions/applicationActions";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { FileText, MapPin, Building2, User } from "lucide-react";
import Link from "next/link";

type AdminAppView = {
    application: any;
    job?: any;
    internship?: any;
    profile: any;
};

export default function AdminApplicationsPage() {
    const [apps, setApps] = useState<AdminAppView[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadData() {
        setLoading(true);
        const data = await getAllApplications();
        setApps(data as AdminAppView[]);
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
                title="Candidate Applications"
                subtitle="Manage job applications across the entire platform and update applicant progression."
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
                                <th className="px-6 py-4 font-medium">Current Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--glass-border)] text-[var(--text-main)]">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-10 text-center"><div className="inline-block w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div></td></tr>
                            ) : apps.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">No applications found.</td></tr>
                            ) : (
                                (apps.map(({ application, job, internship, profile }) => {
                                    const jobOrInternship = job || internship;
                                    const isInternship = !!internship;
                                    const detailHref = isInternship ? `/internships/${jobOrInternship?.id}` : `/jobs/${jobOrInternship?.id}`;

                                    return (
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
                                                <Link href={detailHref} className="hover:text-[var(--primary)] font-medium inline-flex items-center gap-2 transition-colors">
                                                    {jobOrInternship?.title || "Deleted Position"}
                                                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-muted-foreground ml-2">
                                                        {isInternship ? "Internship" : "Job"}
                                                    </span>
                                                </Link>
                                                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                                    <Building2 className="w-3 h-3" /> {jobOrInternship?.company || "Unknown Company"}
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
                                                {application.status === "pending" ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleStatusChange(application.id, "shortlisted")}
                                                            className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md hover:bg-green-500/20 transition-colors text-xs font-semibold"
                                                        >
                                                            Shortlist
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(application.id, "rejected")}
                                                            className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md hover:bg-red-500/20 transition-colors text-xs font-semibold"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${application.status === "shortlisted" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                                        application.status === "interview" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                                                            application.status === "waiting" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-400/20" :
                                                                application.status === "selected" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                                                                    "bg-red-500/10 text-red-400 border border-red-500/20"
                                                        }`}>
                                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                    </span>
                                                )}
                                            </td>
                                    </tr>
                                    );
                                }))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}
