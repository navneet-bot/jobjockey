"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
    FileText, 
    ExternalLink, 
    Clock, 
    Check, 
    X, 
    CheckCircle2, 
    XCircle, 
    Github, 
    Linkedin, 
    Globe, 
    Search,
    BrainCircuit,
    Eye
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

interface ApplicantTableProps {
    applicants: any[];
    onStatusUpdate: () => void;
}

export function ApplicantTable({ applicants, onStatusUpdate }: ApplicantTableProps) {
    const router = useRouter();

    const handleViewProfile = (talent: any) => {
        router.push(`/admin/applicants/${talent.id}`);
    };

    const handleAction = async (action: string, name: string) => {
        toast.info(`${action} feature for ${name} coming soon!`);
    };

    const getCompletionColor = (percent: number) => {
        if (percent >= 90) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
        if (percent >= 70) return "text-blue-500 bg-blue-500/10 border-blue-500/20";
        if (percent >= 50) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    };

    return (
        <GlassCard className="overflow-visible p-0 border-black/5 dark:border-white/5 bg-white/[0.02] dark:bg-white/[0.02]">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-black/5 dark:border-white/5 text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-bold bg-black/5 dark:bg-white/[0.03]">
                            <th className="px-6 py-5">Candidate</th>
                            <th className="px-6 py-5">Profile Created</th>
                            <th className="px-6 py-5 text-center">Status</th>
                            <th className="px-6 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 text-[#111827] dark:text-white">
                        {applicants.map((app) => (
                            <tr key={app.id} className="hover:bg-black/5 dark:hover:bg-white/[0.03] transition-colors group cursor-pointer" onClick={() => handleViewProfile(app)}>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 flex items-center justify-center text-black dark:text-white font-bold text-base uppercase shadow-inner">
                                            {app.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-[#111827] dark:text-white transition-colors tracking-tight">{app.name}</span>
                                            <span className="text-xs text-muted-foreground font-medium">{app.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-xs text-black dark:text-muted-foreground font-medium">
                                        <Clock className="w-3.5 h-3.5 opacity-60 text-black dark:text-muted-foreground" />
                                        {format(new Date(app.createdAt), "MMM d, yyyy")}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <Badge variant="outline" className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border ${getCompletionColor(app.completionPercent)}`}>
                                        {app.completionPercent}% COMPLETE
                                    </Badge>
                                </td>
                                <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleViewProfile(app)}
                                            className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-black dark:text-muted-foreground hover:text-white border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                                            title="View Full Profile"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        
                                        {app.resumeUrl && (
                                            <a
                                                href={app.resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-black dark:text-muted-foreground hover:text-white border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                                                title="View Resume"
                                            >
                                                <FileText className="w-4 h-4" />
                                            </a>
                                        )}

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {applicants.length === 0 && (
                <div className="py-24 text-center">
                    <p className="text-muted-foreground font-medium text-lg">No talent profiles found in the directory.</p>
                    <p className="text-muted-foreground/60 text-sm mt-1">Try adjusting your filters or search keywords.</p>
                </div>
            )}
        </GlassCard>
    );
}
