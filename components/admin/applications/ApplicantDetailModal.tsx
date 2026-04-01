import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// removed scroll-area import
import { Button } from "@/components/ui/button";
import { ExternalLink, User, BrainCircuit } from "lucide-react";
import { AIScoreBadge } from "./AIScoreBadge";
import { SkillMatchCard } from "./SkillMatchCard";

interface ApplicantDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicant: any;
}

export function ApplicantDetailModal({ isOpen, onClose, applicant }: ApplicantDetailModalProps) {
    if (!applicant) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl max-h-[90vh] flex flex-col bg-white dark:bg-black border-[var(--glass-border)] p-0 overflow-hidden shadow-2xl gap-0 font-sans">
                <DialogHeader className="p-6 border-b border-[var(--glass-border)] bg-black/5 dark:bg-white/5">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center text-muted-foreground border border-black/10 dark:border-white/20">
                                <User className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <DialogTitle className="text-xl font-bold text-[var(--text-main)]">
                                    {applicant.candidateName}
                                </DialogTitle>
                                <span className="text-sm text-muted-foreground">{applicant.email}</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-6">
                        {/* Status Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-gray-50 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Status</span>
                                <span className="text-sm font-semibold capitalize text-[var(--text-main)]">{applicant.status}</span>
                            </div>
                            <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-gray-50 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resume</span>
                                {applicant.resumeUrl ? (
                                    <a href={applicant.resumeUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold !text-black dark:!text-[var(--primary)] hover:underline flex items-center gap-1">
                                        View Document <ExternalLink className="w-3 h-3" />
                                    </a>
                                ) : (
                                    <span className="text-sm text-muted-foreground italic">Not provided</span>
                                )}
                            </div>
                        </div>

                        {/* AI Analysis Section */}
                        {applicant.aiAnalyzed ? (
                            <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-indigo-100 dark:border-white/10 shadow-sm transition-all">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold flex items-center gap-2 text-black dark:text-white">
                                        <BrainCircuit className="w-5 h-5" /> AI Analysis
                                    </h3>
                                    <AIScoreBadge score={applicant.aiScore ? Number(applicant.aiScore) : null} classification={applicant.aiClassification} />
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Summary</h4>
                                    <p className="text-sm leading-relaxed text-[var(--text-main)]">
                                        {applicant.aiSummary || "No summary provided by AI."}
                                    </p>
                                </div>

                                <SkillMatchCard matchedSkillsRaw={applicant.aiSkillsMatched} />
                            </div>
                        ) : (
                            <div className="p-6 rounded-xl border border-dashed border-[var(--glass-border)] text-center bg-black/5 dark:bg-white/5 flex flex-col items-center justify-center gap-2">
                                <BrainCircuit className="w-8 h-8 text-muted-foreground opacity-50" />
                                <span className="text-sm font-semibold text-muted-foreground">AI Analysis Pending</span>
                                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">This candidate's resume has not yet been processed by the AI Resume Analyzer.</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-4 border-t border-[var(--glass-border)] bg-black/5 dark:bg-white/5 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="rounded-xl border-[var(--glass-border)]">Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
