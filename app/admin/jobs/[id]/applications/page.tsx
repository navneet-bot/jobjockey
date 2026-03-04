import { getJobApplications } from "@/actions/applicationActions";
import { getSingleJob } from "@/actions/jobActions";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { Building2, FileText, User, Mail, Phone, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { AdminStatusActions } from "@/components/features/admin/AdminStatusActions";

export default async function AdminJobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const job = await getSingleJob(id);

    if (!job) notFound();

    const apps = await getJobApplications(id);

    return (
        <div className="flex flex-col gap-10">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <Link
                        href={`/admin/companies/${job.companyId}/jobs`}
                        className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm font-medium mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Company Jobs
                    </Link>
                    <GradientHeader
                        align="left"
                        title={job.title}
                        subtitle={`Reviewing applications for this position at ${job.company}`}
                    />
                </div>
            </div>

            <GlassCard className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[var(--glass-bg)] border-b border-[var(--glass-border)] text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-medium">Candidate</th>
                                <th className="px-6 py-4 font-medium">Applied At</th>
                                <th className="px-6 py-4 font-medium text-center">Resume</th>
                                <th className="px-6 py-4 font-medium text-right">Status Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--glass-border)] text-[var(--text-main)]">
                            {apps.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">
                                        No applications received for this position yet.
                                    </td>
                                </tr>
                            ) : (
                                apps.map(({ application, profile }) => (
                                    <tr key={application.id} className="hover:bg-[var(--glass-bg)] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-[var(--glass-border)] flex items-center justify-center border border-black/10 dark:border-white/5 shadow-inner">
                                                    <User className="w-5 h-5 text-muted-foreground dark:text-white" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-base">{profile?.name || "Unknown"}</span>
                                                    <span className="text-xs text-muted-foreground">{profile?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {formatDistanceToNow(new Date(application.appliedAt))} ago
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {application.resumeUrl ? (
                                                <a
                                                    href={application.resumeUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-[var(--text-main)] dark:text-[var(--primary)] hover:brightness-110 hover:underline transition-all bg-black/5 dark:bg-[rgba(255,255,255,0.08)] border border-black/10 dark:border-white/5 py-2 px-4 rounded-xl text-xs font-bold"
                                                >
                                                    <FileText className="w-3.5 h-3.5" /> View PDF
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground italic text-xs">Not provided</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <AdminStatusActions
                                                applicationId={application.id}
                                                currentStatus={application.status}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}
