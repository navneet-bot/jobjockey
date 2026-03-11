"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassModal, GlassModalContent, GlassModalHeader, GlassModalTitle, GlassModalDescription } from "@/components/ui/GlassModal";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Trash2, Loader2 } from "lucide-react";
import { adminDeleteJob } from "@/actions/jobActions";
import { adminDeleteInternship } from "@/actions/internshipActions";
import { toast } from "sonner";

export function AdminJobTable({ jobs }: { jobs: any[] }) {
    const [jobToDelete, setJobToDelete] = useState<any | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [list, setList] = useState(jobs);

    const handleDelete = async () => {
        if (!jobToDelete) return;
        setDeleting(true);

        const action = jobToDelete.jobCategory === "internship"
            ? adminDeleteInternship(jobToDelete.id)
            : adminDeleteJob(jobToDelete.id);

        const result = await action;
        setDeleting(false);
        setJobToDelete(null);

        if (result.success) {
            toast.success(`"${jobToDelete.title}" deleted.`);
            setList((prev) => prev.filter((j) => j.id !== jobToDelete.id));
        } else {
            toast.error(result.error || "Failed to delete.");
        }
    };

    return (
        <>
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
                            {list.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No jobs posted yet.</td></tr>
                            ) : (
                                list.map((job) => {
                                    const isInternship = job.jobCategory === "internship";
                                    const detailHref = isInternship ? `/internships/${job.id}` : `/jobs/${job.id}`;
                                    const editHref = isInternship ? `/business/post-job?internshipId=${job.id}` : `/business/post-job?jobId=${job.id}`;

                                    return (
                                        <tr key={job.id} className="hover:bg-[var(--glass-bg)] transition-colors">
                                            <td className="px-6 py-4">
                                                <Link href={detailHref} className="font-semibold text-base hover:text-[var(--text-main)] dark:hover:text-[var(--primary)] transition-colors inline-flex items-center gap-2">
                                                    {job.title}
                                                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">{job.company}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/10 text-[var(--text-main)] dark:text-[var(--primary)] capitalize">
                                                    {job.jobCategory}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">{job.location}</td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {formatDistanceToNow(new Date(job.postedAt))} ago
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link href={editHref}>
                                                        <button className="text-[var(--text-main)] dark:text-[var(--primary)] hover:underline transition-colors text-sm">
                                                            Edit
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => setJobToDelete(job)}
                                                        title="Delete"
                                                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Delete Confirmation Modal */}
            <GlassModal open={!!jobToDelete} onOpenChange={(open) => !open && setJobToDelete(null)}>
                <GlassModalContent>
                    <GlassModalHeader>
                        <GlassModalTitle>Delete Listing</GlassModalTitle>
                        <GlassModalDescription>
                            Are you sure you want to permanently delete{" "}
                            <span className="font-semibold text-[var(--text-main)]">"{jobToDelete?.title}"</span>?
                            This will also remove all applications for this listing. This action cannot be undone.
                        </GlassModalDescription>
                    </GlassModalHeader>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setJobToDelete(null)}
                            disabled={deleting}
                            className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--glass-border)] text-[var(--text-main)] hover:bg-white/5 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {deleting ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</>
                            ) : (
                                <><Trash2 className="w-4 h-4" /> Delete</>
                            )}
                        </button>
                    </div>
                </GlassModalContent>
            </GlassModal>
        </>
    );
}
