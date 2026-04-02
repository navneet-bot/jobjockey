"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { 
    Brain, 
    Check, 
    X, 
    Clock, 
    Briefcase,
    Loader2,
    Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateApplicationStatus } from "@/actions/applicationActions";
import { runAIAnalysis } from "@/actions/aiActions";
import { toast } from "sonner";

interface Application {
    id: string;
    status: string;
    appliedAt: Date;
    title: string;
    company: string;
    category: string;
    jobId?: string | null;
    internshipId?: string | null;
    // AI Fields
    aiScore?: string | null;
    aiAnalyzed?: boolean | null;
    aiSummary?: string | null;
    aiClassification?: string | null;
    aiSkillMatch?: string | null;
}

interface ApplicationPulseProps {
    applications: Application[];
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "selected": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
        case "shortlisted": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
        case "interview": return "text-purple-500 bg-purple-500/10 border-purple-500/20";
        case "rejected": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
        default: return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    }
};

const getMatchColor = (classification: string) => {
    switch (classification?.toLowerCase()) {
        case "top match": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
        case "good match": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
        case "potential": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
        case "weak": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
        default: return "text-muted-foreground bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10";
    }
};

const AIBrainIcon = ({ className }: { className?: string }) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 6.588A3 3 0 1 0 12 18Z" />
        <path d="M12 13V5" />
        <path d="M12 7h5" />
        <path d="M12 12h8" />
        <path d="M12 17h5" />
        <circle cx="17" cy="7" r="1.5" fill="currentColor" />
        <circle cx="20" cy="12" r="1.5" fill="currentColor" />
        <circle cx="17" cy="17" r="1.5" fill="currentColor" />
    </svg>
);

export function ApplicationPulse({ applications }: ApplicationPulseProps) {
    const [isPending, startTransition] = useTransition();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<string | null>(null);

    const handleStatusUpdate = (id: string, status: "shortlisted" | "rejected") => {
        setLoadingId(`${id}-${status}`);
        setActionType(status);
        
        startTransition(async () => {
            const res = await updateApplicationStatus(id, status);
            if (res.success) {
                toast.success(`Candidate ${status === "shortlisted" ? "shortlisted" : "rejected"} successfully`);
            } else {
                toast.error(res.error || "Failed to update status");
            }
            setLoadingId(null);
            setActionType(null);
        });
    };

    const handleAIAnalysis = (id: string, jobId: string, category: string) => {
        setLoadingId(`${id}-ai`);
        setActionType("ai");
        
        startTransition(async () => {
            const isInternship = category === "INTERNSHIP";
            const res = await runAIAnalysis(jobId, isInternship);
            if (res.success) {
                toast.success("AI Analysis completed successfully");
            } else {
                toast.error(res.error || "AI Analysis failed");
            }
            setLoadingId(null);
            setActionType(null);
        });
    };

    return (
        <div className="overflow-x-auto text-[13px]">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-black/5 dark:bg-white/[0.02] text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                        <th className="px-8 py-5">Position</th>
                        <th className="px-6 py-5">AI Match</th>
                        <th className="px-6 py-5">Applied Date</th>
                        <th className="px-6 py-5">Status</th>
                        <th className="px-8 py-5 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5 text-[#111827] dark:text-white">
                    {applications.map((app) => {
                        const targetId = app.jobId || app.internshipId || "";
                        const isThisLoading = (type: string) => loadingId === `${app.id}-${type}`;

                        return (
                            <tr key={app.id} className="hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#111827] dark:text-white tracking-tight">{app.title}</span>
                                        <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mt-1.5">{app.company}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    {app.aiAnalyzed ? (
                                        <div className="flex flex-col gap-1.5">
                                            <Badge variant="outline" className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border w-fit ${getMatchColor(app.aiClassification || "")}`}>
                                                {app.aiClassification}
                                            </Badge>
                                            <div className="flex items-center gap-2">
                                                <div className="text-[14px] font-black text-[#111827] dark:text-white tracking-tighter">
                                                    {app.aiScore}%
                                                </div>
                                                <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest opacity-60">Score</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-muted-foreground/40">
                                            <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center border border-dashed border-black/20 dark:border-white/20">
                                                <AIBrainIcon className="w-3.5 h-3.5 opacity-40" />
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest">Pending</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-6 font-semibold">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="w-3.5 h-3.5 opacity-60" />
                                        {format(new Date(app.appliedAt), "MMM d, yyyy")}
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <Badge variant="outline" className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter border shadow-sm ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </Badge>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        {/* AI Analysis Button */}
                                        <Button
                                            onClick={() => handleAIAnalysis(app.id, targetId, app.category)}
                                            disabled={!!loadingId || !targetId}
                                            variant="outline"
                                            size="icon"
                                            className="w-10 h-10 rounded-xl border-black/20 dark:border-white/20 bg-white dark:bg-white/5 hover:bg-purple-500/10 hover:border-purple-500/40 group transition-all shadow-sm"
                                            title={app.aiAnalyzed ? "Re-run AI Match Score" : "Run AI Match Score"}
                                        >
                                            {isThisLoading("ai") ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                                            ) : (
                                                <AIBrainIcon className="w-4 h-4 text-purple-600 opacity-80 group-hover:opacity-100" />
                                            )}
                                        </Button>

                                        {/* Shortlist Button */}
                                        <Button
                                            onClick={() => handleStatusUpdate(app.id, "shortlisted")}
                                            disabled={!!loadingId || app.status === "shortlisted"}
                                            variant="outline"
                                            size="icon"
                                            className="w-10 h-10 rounded-xl border-black/20 dark:border-white/20 bg-white dark:bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 group transition-all shadow-sm"
                                            title="Shortlist Candidate"
                                        >
                                            {isThisLoading("shortlisted") ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                                            ) : (
                                                <Check className="w-4 h-4 text-emerald-600 opacity-70 group-hover:opacity-100" />
                                            )}
                                        </Button>

                                        {/* Reject Button */}
                                        <Button
                                            onClick={() => handleStatusUpdate(app.id, "rejected")}
                                            disabled={!!loadingId || app.status === "rejected"}
                                            variant="outline"
                                            size="icon"
                                            className="w-10 h-10 rounded-xl border-black/20 dark:border-white/20 bg-white dark:bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/40 group transition-all shadow-sm"
                                            title="Reject Candidate"
                                        >
                                            {isThisLoading("rejected") ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                                            ) : (
                                                <X className="w-4 h-4 text-rose-600 opacity-70 group-hover:opacity-100" />
                                            )}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    {applications.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-8 py-20 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                                        <Briefcase className="w-6 h-6 text-black/10 dark:text-white/10" />
                                    </div>
                                    <p className="text-muted-foreground font-bold tracking-widest text-xs uppercase opacity-40">No active applications found</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
