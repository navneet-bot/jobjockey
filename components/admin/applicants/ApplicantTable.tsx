"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Clock, Check, X, CheckCircle2, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { updateApplicationStatus } from "@/actions/applicationActions";
import { toast } from "sonner";
import { useState } from "react";

interface ApplicantTableProps {
    applicants: any[];
    onStatusUpdate: () => void;
}

export function ApplicantTable({ applicants, onStatusUpdate }: ApplicantTableProps) {
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleStatusChange = async (id: string, status: "shortlisted" | "rejected") => {
        setUpdatingId(id);
        try {
            const res = await updateApplicationStatus(id, status);
            if (res.success) {
                toast.success(`Candidate ${status} successfully`);
                onStatusUpdate();
            } else {
                toast.error(res.error || "Failed to update status");
            }
        } catch (err) {
            toast.error("An error occurred while updating status");
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "shortlisted":
                return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1 font-bold uppercase tracking-wider text-[10px]">Shortlisted</Badge>;
            case "rejected":
                return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1 font-bold uppercase tracking-wider text-[10px]">Rejected</Badge>;
            case "pending":
            default:
                return <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/20 px-3 py-1 font-bold uppercase tracking-wider text-[10px]">Pending</Badge>;
        }
    };

    return (
        <GlassCard className="overflow-visible p-0 border-black/5 dark:border-white/5 bg-white/[0.02] dark:bg-white/[0.02]">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="border-b border-black/5 dark:border-white/5 text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-bold bg-black/5 dark:bg-white/[0.03]">
                            <th className="px-8 py-5">Candidate</th>
                            <th className="px-6 py-5">Applied Position</th>
                            <th className="px-6 py-5">Resume</th>
                            <th className="px-6 py-5">Applied At</th>
                            <th className="px-6 py-5">Current Status</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 text-[#111827] dark:text-white">
                        {applicants.map((app) => (
                            <tr key={app.id} className="hover:bg-black/5 dark:hover:bg-white/[0.03] transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 flex items-center justify-center text-black dark:text-white font-bold text-base uppercase shadow-inner">
                                            {app.candidateName.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-[#111827] dark:text-white transition-colors tracking-tight">{app.candidateName}</span>
                                            <span className="text-xs text-muted-foreground font-medium">{app.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm text-[var(--text-main)]">{app.jobTitle}</span>
                                            <Badge variant="outline" className="bg-white/5 border-white/10 text-[9px] px-2 py-0 font-black tracking-tighter opacity-70">
                                                {app.category}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                                            {app.companyDomain || app.companyName}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    {app.resumeUrl ? (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="rounded-xl h-8 text-[11px] font-bold border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 !text-black dark:!text-white hover:bg-black/10 dark:hover:bg-white/10 gap-2 px-3 shadow-sm hover:border-black/20 dark:hover:border-white/20 transition-all font-sans"
                                            asChild
                                        >
                                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                                                <FileText className="size-3.5 opacity-70 !text-black dark:!text-white" />
                                                View PDF
                                            </a>
                                        </Button>
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic font-medium opacity-60">Not provided</span>
                                    )}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                        <Clock className="w-4 h-4 opacity-60" />
                                        {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    {getStatusBadge(app.status)}
                                </td>
                                <td className="px-8 py-5 text-right">
                                    {app.status === "pending" ? (
                                        <div className="flex items-center justify-end gap-2.5">
                                            <button
                                                disabled={updatingId === app.id}
                                                onClick={() => handleStatusChange(app.id, "shortlisted")}
                                                className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all disabled:opacity-50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                                title="Shortlist Candidate"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                disabled={updatingId === app.id}
                                                onClick={() => handleStatusChange(app.id, "rejected")}
                                                className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                                                title="Reject Candidate"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end opacity-50 pr-2">
                                            {app.status === "shortlisted" ? (
                                                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {applicants.length === 0 && (
                <div className="py-24 text-center">
                    <p className="text-muted-foreground font-medium text-lg">No candidates match your current filters.</p>
                    <p className="text-muted-foreground/60 text-sm mt-1">Try adjusting your search criteria Above.</p>
                </div>
            )}
        </GlassCard>
    );
}
