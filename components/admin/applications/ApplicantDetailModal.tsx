import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, User, BrainCircuit, CheckCircle2, XCircle, Github, Globe, Linkedin, FileText, TrendingUp, AlertTriangle } from "lucide-react";
import { AIScoreBadge } from "./AIScoreBadge";
import { SkillMatchCard } from "./SkillMatchCard";
import { GlassCard } from "@/components/ui/GlassCard";

interface ApplicantDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicant: any;
}

function parseJsonArray(raw: string | null | undefined): string[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function SkillMatchGauge({ value }: { value: number }) {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    const color =
        value >= 75 ? "#22c55e" :
        value >= 50 ? "#3b82f6" :
        value >= 25 ? "#eab308" :
        "#ef4444";

    return (
        <div className="flex flex-col items-center gap-1.5">
            <svg width="88" height="88" className="transform -rotate-90">
                <circle
                    cx="44" cy="44" r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-black/5 dark:text-white/10"
                />
                <circle
                    cx="44" cy="44" r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center" style={{ width: 88, height: 88 }}>
                <span className="text-xl font-black text-[var(--text-main)]">{value}%</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Skill Match</span>
        </div>
    );
}

function SourceIndicators({ applicant }: { applicant: any }) {
    const sources = [
        { key: "resume", icon: FileText, label: "Resume", available: !!applicant.resumeUrl },
        { key: "github", icon: Github, label: "GitHub", available: !!applicant.github },
        { key: "portfolio", icon: Globe, label: "Portfolio", available: !!applicant.portfolioUrl },
        { key: "linkedin", icon: Linkedin, label: "LinkedIn", available: !!applicant.linkedin },
    ];

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {sources.map(({ key, icon: Icon, label, available }) => (
                <div
                    key={key}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        available
                            ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                            : "bg-black/5 dark:bg-white/5 text-muted-foreground border-black/5 dark:border-white/5 opacity-50"
                    }`}
                    title={available ? `${label} data available` : `${label} not provided`}
                >
                    <Icon className="w-3 h-3" />
                    {label}
                    {available ? (
                        <CheckCircle2 className="w-3 h-3" />
                    ) : (
                        <XCircle className="w-3 h-3" />
                    )}
                </div>
            ))}
        </div>
    );
}

export function ApplicantDetailModal({ isOpen, onClose, applicant }: ApplicantDetailModalProps) {
    if (!applicant) return null;

    const strengths = parseJsonArray(applicant.aiStrengths);
    const gaps = parseJsonArray(applicant.aiGaps);
    const skillMatch = applicant.aiSkillMatch ? Number(applicant.aiSkillMatch) : null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-black border-[var(--glass-border)] p-0 overflow-hidden shadow-2xl gap-0 font-sans">
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
                        {/* Status + Resume Grid */}
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

                        {/* Data Sources */}
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Data Sources Used</span>
                            <SourceIndicators applicant={applicant} />
                        </div>

                        {/* AI Analysis Section */}
                        {applicant.aiAnalyzed ? (
                            <div className="flex flex-col gap-5 p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-indigo-100 dark:border-white/10 shadow-sm transition-all">
                                {/* Header with Score + Skill Match Gauge */}
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-lg font-bold flex items-center gap-2 text-black dark:text-white">
                                            <BrainCircuit className="w-5 h-5" /> AI Analysis
                                        </h3>
                                        <AIScoreBadge score={applicant.aiScore ? Number(applicant.aiScore) : null} classification={applicant.aiClassification} />
                                    </div>
                                    {skillMatch !== null && (
                                        <div className="relative flex items-center justify-center">
                                            <SkillMatchGauge value={skillMatch} />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Summary */}
                                <div className="flex flex-col gap-2">
                                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Summary</h4>
                                    <p className="text-sm leading-relaxed text-[var(--text-main)]">
                                        {applicant.aiSummary || "No summary provided by AI."}
                                    </p>
                                </div>

                                {/* Strengths */}
                                {strengths.length > 0 && (
                                    <div className="flex flex-col gap-2.5">
                                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                            <TrendingUp className="w-3.5 h-3.5 text-green-500" /> Strengths
                                        </h4>
                                        <div className="flex flex-col gap-1.5">
                                            {strengths.map((s: string, i: number) => (
                                                <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-green-500/5 border border-green-500/10">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-[var(--text-main)] leading-relaxed">{s}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Gaps */}
                                {gaps.length > 0 && (
                                    <div className="flex flex-col gap-2.5">
                                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Gaps & Limitations
                                        </h4>
                                        <div className="flex flex-col gap-1.5">
                                            {gaps.map((g: string, i: number) => (
                                                <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-red-500/5 border border-red-500/10">
                                                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-[var(--text-main)] leading-relaxed">{g}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <SkillMatchCard matchedSkillsRaw={applicant.aiSkillsMatched} />
                            </div>
                        ) : (
                            <div className="p-6 rounded-xl border border-dashed border-[var(--glass-border)] text-center bg-black/5 dark:bg-white/5 flex flex-col items-center justify-center gap-2">
                                <BrainCircuit className="w-8 h-8 text-muted-foreground opacity-50" />
                                <span className="text-sm font-semibold text-muted-foreground">AI Analysis Pending</span>
                                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">This candidate&apos;s resume has not yet been processed by the AI Candidate Intelligence Engine.</p>
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
