"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowLeft, User, FileText, Check, X, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { AIScoreBadge } from "./AIScoreBadge";
import { ApplicantDetailModal } from "./ApplicantDetailModal";
import { AIShortlistButton } from "./AIShortlistButton";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Sparkles, Trophy } from "lucide-react";
import { updateApplicationStatus } from "@/actions/applicationActions";
import { toast } from "sonner";

export function ApplicantList({ 
    applicants, 
    jobTitle, 
    jobId, 
    isInternship,
    onBack, 
    onRefresh 
}: { 
    applicants: any[], 
    jobTitle: string, 
    jobId: string, 
    isInternship: boolean,
    onBack: () => void, 
    onRefresh: () => void 
}) {
    const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
    const [shortlistLimit, setShortlistLimit] = useState<string>("all");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleStatusChange = async (e: React.MouseEvent, id: string, status: "shortlisted" | "rejected") => {
        e.stopPropagation();
        setUpdatingId(id);
        try {
            const res = await updateApplicationStatus(id, status);
            if (res.success) {
                toast.success(`Candidate ${status} successfully`);
                onRefresh();
            } else {
                toast.error(res.error || "Failed to update status");
            }
        } catch (err) {
            toast.error("An error occurred while updating status");
        } finally {
            setUpdatingId(null);
        }
    };

    // Sort by AI Score (highest first) when filtering
    const sortedApplicants = [...applicants].sort((a, b) => {
        const scoreA = Number(a.aiScore || 0);
        const scoreB = Number(b.aiScore || 0);
        return scoreB - scoreA;
    });

    const displayedApplicants = shortlistLimit === "all" 
        ? applicants 
        : sortedApplicants.slice(0, parseInt(shortlistLimit));

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={onBack} size="sm" className="gap-2 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-[#111827] dark:text-white hover:bg-black/10 hover:text-black dark:hover:bg-white/10 dark:hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Jobs
                    </Button>
                <h2 className="text-xl font-bold text-[#111827] dark:text-white">Applicants for <span className="text-black dark:text-[var(--primary)]">{jobTitle}</span></h2>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={shortlistLimit} onValueChange={setShortlistLimit}>
                        <SelectTrigger className="h-12 w-[180px] bg-white dark:bg-[#111827] text-black dark:text-white border-black/10 dark:border-white/10 rounded-2xl font-bold shadow-xl">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-yellow-500" />
                                <SelectValue placeholder="Shortlist View" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-[#0A0F1F] text-black dark:text-white border-black/10 dark:border-white/10 rounded-xl shadow-2xl">
                            <SelectItem value="all">All Applicants</SelectItem>
                            <SelectItem value="5">Top 5 Matches</SelectItem>
                            <SelectItem value="10">Top 10 Matches</SelectItem>
                            <SelectItem value="20">Top 20 Matches</SelectItem>
                        </SelectContent>
                    </Select>
                    <AIShortlistButton jobId={jobId} isInternship={isInternship} onComplete={onRefresh} />
                </div>
            </div>

            {applicants.length === 0 ? (
                <GlassCard className="p-10 text-center flex flex-col items-center gap-3">
                    <User className="w-10 h-10 text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground font-medium">No candidates have applied to this position yet.</p>
                </GlassCard>
            ) : (
                <GlassCard className="p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[var(--glass-bg)] border-b border-[var(--glass-border)] text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Candidate Name</th>
                                    <th className="px-6 py-4 font-medium">AI Score</th>
                                    <th className="px-6 py-4 font-medium">Skill Match</th>
                                    <th className="px-6 py-4 font-medium">Applied Date</th>
                                    <th className="px-6 py-4 font-medium">Resume List</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--glass-border)] text-[var(--text-main)]">
                                {displayedApplicants.map((app) => (
                                    <tr 
                                        key={app.id} 
                                        onClick={() => setSelectedApplicant(app)}
                                        className="hover:bg-[var(--glass-bg)] transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-[var(--glass-border)] flex items-center justify-center border border-black/10 dark:border-white/5 shadow-inner">
                                                    <User className="w-4 h-4 text-muted-foreground dark:text-white" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-base">{app.candidateName}</span>
                                                    <span className="text-xs text-muted-foreground">{app.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <AIScoreBadge score={app.aiScore ? Number(app.aiScore) : null} classification={app.aiClassification} />
                                        </td>
                                        <td className="px-6 py-4">
                                            {app.aiSkillMatch ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full transition-all duration-500 ${
                                                                Number(app.aiSkillMatch) >= 75 ? 'bg-green-500' :
                                                                Number(app.aiSkillMatch) >= 50 ? 'bg-blue-500' :
                                                                Number(app.aiSkillMatch) >= 25 ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                            }`}
                                                            style={{ width: `${Math.min(100, Number(app.aiSkillMatch))}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-semibold text-muted-foreground">{Number(app.aiSkillMatch).toFixed(0)}%</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic text-xs">--</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {formatDistanceToNow(new Date(app.appliedAt))} ago
                                        </td>
                                        <td className="px-6 py-4">
                                            {app.resumeUrl ? (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); window.open(app.resumeUrl, "_blank"); }}
                                                    className="inline-flex items-center gap-1.5 !text-black dark:!text-white hover:underline hover:brightness-110 transition-colors bg-black/5 dark:bg-white/10 px-3 py-1.5 rounded-full text-xs font-semibold"
                                                >
                                                    <FileText className="w-3 h-3 !text-black dark:!text-white" /> View PDF
                                                </button>
                                            ) : (
                                                <span className="text-muted-foreground italic text-xs">Not provided</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize border ${
                                                app.status === 'pending' ? 'bg-gray-500/10 text-gray-500 border-gray-500/20' :
                                                app.status === 'shortlisted' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                app.status === 'interview' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                app.status === 'waiting' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                app.status === 'selected' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {app.status === "pending" ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        disabled={updatingId === app.id}
                                                        onClick={(e) => handleStatusChange(e, app.id, "shortlisted")}
                                                        className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 transition-all disabled:opacity-50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                                        title="Shortlist"
                                                    >
                                                        {updatingId === app.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <button
                                                        disabled={updatingId === app.id}
                                                        onClick={(e) => handleStatusChange(e, app.id, "rejected")}
                                                        className="p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                                                        title="Reject"
                                                    >
                                                        {updatingId === app.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                                                    {app.status === "shortlisted" ? (
                                                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                                    ) : app.status === "rejected" ? (
                                                        <XCircle className="w-5 h-5 text-red-500" />
                                                    ) : (
                                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            )}

            {selectedApplicant && (
                <ApplicantDetailModal 
                    isOpen={!!selectedApplicant} 
                    onClose={() => setSelectedApplicant(null)} 
                    applicant={selectedApplicant} 
                />
            )}
        </div>
    );
}
