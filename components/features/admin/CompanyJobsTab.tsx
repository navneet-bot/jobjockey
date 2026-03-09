"use client";

import { useEffect, useState } from "react";
import { getCompanyJobsForAdmin } from "@/actions/applicationActions";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDistanceToNow } from "date-fns";
import { Eye, ExternalLink } from "lucide-react";
import Link from "next/link";

export function CompanyJobsTab({ companyId }: { companyId: string }) {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadJobs() {
            setLoading(true);
            const data = await getCompanyJobsForAdmin(companyId);
            setJobs(data);
            setLoading(false);
        }
        loadJobs();
    }, [companyId]);

    return (
        <GlassCard className="p-0 overflow-hidden border-black/5 dark:border-white/5">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4 font-medium">Job Title</th>
                            <th className="px-6 py-4 font-medium">Job Type</th>
                            <th className="px-6 py-4 font-medium text-center">Posted Date</th>
                            <th className="px-6 py-4 font-medium text-center">Applications</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 text-[var(--text-main)]">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-10 text-center"><div className="inline-block w-6 h-6 border-2 border-[var(--text-main)] dark:border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div></td></tr>
                        ) : jobs.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">No jobs posted yet.</td></tr>
                        ) : (
                            jobs.map((job) => (
                                <tr key={job.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/jobs/${job.id}`}
                                            className="font-semibold text-[var(--text-main)] hover:text-[var(--text-main)] dark:hover:text-[var(--primary)] transition-colors inline-flex items-center gap-2"
                                            target="_blank"
                                        >
                                            {job.title}
                                            <div className="p-1 rounded bg-black/5 dark:bg-white/10 group-hover:bg-[var(--primary)]/10">
                                                <ExternalLink className="w-3 h-3 text-muted-foreground" />
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{job.jobType}</td>
                                    <td className="px-6 py-4 text-center text-muted-foreground">
                                        {formatDistanceToNow(new Date(job.postedAt))} ago
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-[var(--text-main)] dark:text-[var(--primary)]">
                                        {job.applicationCount}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/jobs/${job.id}/applications`}
                                            title="View Applications"
                                            className="p-2 rounded-full bg-black/5 dark:bg-white/10 text-[var(--text-main)] dark:text-[var(--primary)] hover:bg-black/10 dark:hover:bg-white/20 transition-colors inline-flex items-center"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
}
