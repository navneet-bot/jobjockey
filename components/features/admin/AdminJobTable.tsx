"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";

export function AdminJobTable({ jobs }: { jobs: any[] }) {
    return (
        <GlassCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[var(--glass-bg)] border-b border-[var(--glass-border)] text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4 font-medium">Job Title</th>
                            <th className="px-6 py-4 font-medium">Company</th>
                            <th className="px-6 py-4 font-medium">Category</th>
                            <th className="px-6 py-4 font-medium">Location</th>
                            <th className="px-6 py-4 font-medium">Posted</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--glass-border)] text-[var(--text-main)]">
                        {jobs.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No jobs posted yet.</td></tr>
                        ) : (
                            jobs.map((job) => {
                                const isInternship = job.category === "internship";
                                const detailHref = isInternship ? `/internships/${job.id}` : `/jobs/${job.id}`;
                                const editHref = isInternship ? `/business/post-job?internshipId=${job.id}` : `/business/post-job?jobId=${job.id}`;
                                
                                return (
                                    <tr key={job.id} className="hover:bg-[var(--glass-bg)] transition-colors">
                                        <td className="px-6 py-4">
                                            <Link href={detailHref} className="font-semibold text-base hover:text-[var(--primary)] transition-colors inline-flex items-center gap-2">
                                                {job.title}
                                                <ExternalLink className="w-3 h-3 text-muted-foreground" />
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{job.company}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/10 text-[var(--text-main)] dark:text-[var(--primary)] capitalize">
                                                {job.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{job.location}</td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {formatDistanceToNow(new Date(job.postedAt))} ago
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={editHref}>
                                                <button className="text-[var(--text-main)] dark:text-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                                                    Edit
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
}
