"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { ChevronRight, Briefcase, Users, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

export function JobList({ jobs, companyName, onSelect, onBack }: { jobs: any[], companyName: string, onSelect: (id: string, title: string, category: string) => void, onBack: () => void }) {
    
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={onBack} size="sm" className="gap-2 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-[#111827] dark:text-white hover:bg-black/10 hover:text-black dark:hover:bg-white/10 dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Companies
                </Button>
                <h2 className="text-xl font-bold text-[#111827] dark:text-white">Jobs by <span className="text-black dark:text-[var(--primary)]">{companyName}</span></h2>
            </div>

            {jobs.length === 0 ? (
                <GlassCard className="p-10 text-center">
                    <p className="text-muted-foreground">No jobs or internships found for this company.</p>
                </GlassCard>
            ) : (
                <GlassCard className="p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[var(--glass-bg)] border-b border-[var(--glass-border)] text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Job Title</th>
                                    <th className="px-6 py-4 font-medium">Category</th>
                                    <th className="px-6 py-4 font-medium">Total Applicants</th>
                                    <th className="px-6 py-4 font-medium">Created Date</th>
                                    <th className="px-6 py-4 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--glass-border)] text-[var(--text-main)]">
                                {jobs.map((job) => (
                                    <tr key={job.id} onClick={() => onSelect(job.id, job.title, job.category)} className="hover:bg-[var(--glass-bg)] transition-colors cursor-pointer group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-[var(--glass-border)] flex items-center justify-center border border-black/10 dark:border-white/5 shadow-inner">
                                                    <Briefcase className="w-4 h-4 text-muted-foreground dark:text-white" />
                                                </div>
                                                <span className="font-semibold text-base">{job.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${job.category === 'Job' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-purple-500/10 text-purple-500 border-purple-500/20'}`}>
                                                {job.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-4 h-4 text-black dark:text-white" />
                                                {job.totalApplicants}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {job.createdAt ? formatDistanceToNow(new Date(job.createdAt)) + " ago" : "Unknown"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                className="inline-flex items-center gap-1 text-black dark:text-[var(--primary)] text-xs font-semibold hover:underline"
                                            >
                                                View Applicants <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
