"use client";

import { useEffect, useState } from "react";
import { getCompanyApplications, updateApplicationStatus } from "@/actions/applicationActions";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Check, X, FileText } from "lucide-react";

export function CompanyApplicationsTab({ companyId }: { companyId: string }) {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadApplications() {
        setLoading(true);
        // Note: the original getCompanyApplications doesn't take a companyId, it uses user metadata or fetches all for admin.
        // We might need a specific getApplicationsByCompany action or filtered getAllApplications.
        // For now, let's filter the results of getCompanyApplications (which for admin returns all)
        const data = await getCompanyApplications();
        // Filter applications that belong to jobs of this specific company
        const filtered = data.filter((app: any) => app.job.companyId === companyId);
        setApplications(filtered);
        setLoading(false);
    }

    useEffect(() => {
        loadApplications();
    }, [companyId]);

    const handleStatusUpdate = async (id: string, newStatus: "shortlisted" | "rejected") => {
        const res = await updateApplicationStatus(id, newStatus);
        if (res.success) {
            toast.success(`Application updated successfully.`);
            loadApplications();
        } else {
            toast.error(res.error || "Failed to update application.");
        }
    };

    return (
        <GlassCard className="p-0 overflow-hidden border-black/5 dark:border-white/5">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4 font-medium">Candidate Name</th>
                            <th className="px-6 py-4 font-medium">Contact</th>
                            <th className="px-6 py-4 font-medium">Applied Job</th>
                            <th className="px-6 py-4 font-medium text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 text-[var(--text-main)]">
                        {loading ? (
                            <tr><td colSpan={4} className="px-6 py-10 text-center"><div className="inline-block w-6 h-6 border-2 border-[var(--text-main)] dark:border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div></td></tr>
                        ) : applications.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">No applications yet.</td></tr>
                        ) : (
                            applications.map((app) => (
                                <tr key={app.application.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{app.profile.name}</span>
                                            {app.application.resumeUrl && (
                                                <a href={app.application.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-[var(--text-main)] hover:underline flex items-center gap-1 transition-colors">
                                                    <FileText className="w-3 h-3 text-[var(--text-main)]" /> View Resume
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        <div className="flex flex-col text-xs">
                                            <span>{app.profile.email}</span>
                                            <span>{app.profile.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{app.job.title}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${app.application.status === 'shortlisted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                            app.application.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                            }`}>
                                            {app.application.status.charAt(0).toUpperCase() + app.application.status.slice(1)}
                                        </span>
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
