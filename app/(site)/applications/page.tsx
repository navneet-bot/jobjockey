"use client";

import { useEffect, useState } from "react";
import { getMyApplications } from "@/actions/applicationActions";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { Building2, Calendar, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { GradientButton } from "@/components/ui/GradientButton";
import Link from "next/link";

type WrappedApp = {
    application: any;
    job?: any;
    internship?: any;
};

export default function ApplicationsPage() {
    const [apps, setApps] = useState<WrappedApp[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const data = await getMyApplications();
            setApps(data as WrappedApp[]);
            setLoading(false);
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending": return <span className="px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-xs font-medium">Pending</span>;
            case "shortlisted": return <span className="px-3 py-1 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20 text-xs font-medium">Shortlisted</span>;
            case "interview": return <span className="px-3 py-1 rounded-full bg-purple-400/10 text-purple-400 border border-purple-400/20 text-xs font-medium">Interviewing</span>;
            case "selected": return <span className="px-3 py-1 rounded-full bg-green-400/10 text-green-400 border border-green-400/20 text-xs font-medium">Offer Provided</span>;
            case "rejected": return <span className="px-3 py-1 rounded-full bg-red-400/10 text-red-400 border border-red-400/20 text-xs font-medium">Rejected</span>;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col gap-10 pb-20 items-center min-h-[80vh]">
            <GradientHeader
                title="Your Applications"
                subtitle="Track the status of all your job, internship, and training submissions."
                badge="Activity Dashboard"
            />

            <div className="w-full max-w-4xl flex flex-col gap-6">
                {apps.length === 0 ? (
                    <GlassCard className="py-20 text-center flex flex-col items-center gap-4">
                        <h3 className="text-xl font-medium text-[var(--text-main)]">You haven't applied to anything yet.</h3>
                        <p className="text-muted-foreground">Find your next big opportunity today.</p>
                        <Link href="/jobs" className="mt-4">
                            <GradientButton>Browse Jobs</GradientButton>
                        </Link>
                    </GlassCard>
                ) : (
                    apps.map(({ application, job, internship }) => {
                        const jobOrInternship = job || internship;
                        const isInternship = !!internship;
                        const detailHref = isInternship ? `/internships/${jobOrInternship?.id}` : `/jobs/${jobOrInternship?.id}`;

                        return (
                            <GlassCard key={application.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hoverLift">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center border border-border mt-1">
                                        <Building2 className="text-muted-foreground w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Link href={detailHref} className="dark:hover:text-[var(--primary)] hover:text-[#111827] transition-colors">
                                            <h3 className="text-xl font-bold text-[var(--text-main)]">
                                                {jobOrInternship?.title || "Deleted Position"}
                                                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-muted-foreground ml-2">
                                                    {isInternship ? "Internship" : "Job"}
                                                </span>
                                            </h3>
                                        </Link>
                                        <p className="text-muted-foreground font-medium">{jobOrInternship?.company || "Unknown Company"}</p>

                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <Calendar className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                                            Applied {formatDistanceToNow(new Date(application.appliedAt))} ago
                                        </div>

                                        {application.resumeUrl && (
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <FileText className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                                                <a href={application.resumeUrl} target="_blank" rel="noreferrer" className="dark:hover:text-[var(--primary)] hover:text-[#111827] hover:underline">
                                                    View Submitted Resume
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                </div>

                                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                    {getStatusBadge(application.status)}
                                </div>
                            </GlassCard>
                        );
                    })
                )}
            </div>
        </div>
    );
}
