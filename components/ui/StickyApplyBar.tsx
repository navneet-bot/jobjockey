"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./GlassCard";
import { GradientButton } from "./GradientButton";
import { toast } from "sonner";
import { applyForJob } from "@/actions/applicationActions";
import { UploadDropzone } from "@/lib/uploadthing";
import { FileText, CheckCircle2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface StickyApplyBarProps {
    jobId: string;
    category: "job" | "internship";
    salary?: string | null;
    initialResumeUrl?: string | null;
}

export function StickyApplyBar({ jobId, category, salary, initialResumeUrl }: StickyApplyBarProps) {
    const [resumeUrl, setResumeUrl] = useState<string | null>(initialResumeUrl || null);
    const [isApplying, setIsApplying] = useState(false);
    const [isUploadingResume, setIsUploadingResume] = useState(false);
    const [open, setOpen] = useState(false);

    const handleApply = async () => {
        if (!resumeUrl) {
            toast.error("Please upload your resume first");
            return;
        }
        setIsApplying(true);
        const res = await applyForJob(jobId, category, resumeUrl);
        setIsApplying(false);

        if (res.success) {
            toast.success("Application submitted successfully!");
            setOpen(false);
        } else {
            toast.error(res.error || "Failed to submit application");
        }
    };

    return (
        <div className="fixed bottom-0 left-0 w-full z-40 p-4 md:p-6 translate-y-0 animate-in slide-in-from-bottom-full duration-500">
            <GlassCard className="max-w-4xl mx-auto flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)] !p-4 md:!py-4 md:!px-8 border-t border-[var(--glass-border)] rounded-full">
                <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-0.5">Compensation</p>
                    <p className="font-bold text-xl text-[var(--text-main)] italic">{salary || "Competitive Salary"}</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <GradientButton className="w-full sm:w-auto px-10">
                            Apply Now
                        </GradientButton>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-[#0A0A0A] border-[var(--glass-border)] text-white">
                        <DialogHeader>
                            <DialogTitle className="text-xl">Submit Application</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Attach your resume to stand out to the employer.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-6 py-4">
                            {resumeUrl ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 p-4 bg-[var(--glass-bg)] border border-[var(--primary)]/30 rounded-xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 to-transparent pointer-events-none" />
                                        <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center shrink-0">
                                            <FileText className="w-5 h-5 text-[var(--primary)]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">Resume Attached</p>
                                            <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-[var(--primary)] hover:underline truncate block">
                                                View Document
                                            </a>
                                        </div>
                                        <CheckCircle2 className="w-5 h-5 text-[var(--primary)] shrink-0" />
                                    </div>
                                    <button
                                        onClick={() => setResumeUrl(null)}
                                        className="text-xs text-muted-foreground hover:text-white transition-colors self-start"
                                    >
                                        Upload a different file
                                    </button>
                                </div>
                            ) : (
                                <div className="border border-dashed border-[var(--glass-border)] rounded-xl p-2 relative overflow-hidden">
                                    {isUploadingResume && (
                                        <div className="absolute inset-0 z-10 bg-black/60 flex flex-col items-center justify-center gap-3 animate-in fade-in duration-300">
                                            <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                                            <p className="text-sm font-medium text-[var(--primary)]">Uploading Resume...</p>
                                        </div>
                                    )}
                                    <UploadDropzone
                                        endpoint="resumeUploader"
                                        onUploadBegin={() => setIsUploadingResume(true)}
                                        onClientUploadComplete={(res) => {
                                            console.log("Resume upload complete:", res);
                                            setIsUploadingResume(false);
                                            if (res?.[0]?.url) {
                                                setResumeUrl(res[0].url);
                                                toast.success("Resume uploaded!");
                                            } else {
                                                toast.error("Upload succeeded but no URL returned.");
                                            }
                                        }}
                                        onUploadError={(error: Error) => {
                                            setIsUploadingResume(false);
                                            console.error("Resume upload error:", error);
                                            toast.error(`Upload failed: ${error.message}`);
                                        }}
                                        className="ut-label:text-[var(--primary)] ut-button:bg-[var(--primary)] ut-button:text-black"
                                    />
                                </div>
                            )}

                            <div className="space-y-4 pt-2">
                                <GradientButton
                                    onClick={handleApply}
                                    disabled={isApplying || isUploadingResume || !resumeUrl}
                                    className={cn(
                                        "w-full flex items-center justify-center gap-2 group transition-all duration-300",
                                        (!resumeUrl || isUploadingResume) && "opacity-50 grayscale cursor-not-allowed scale-100! hover:scale-100!"
                                    )}
                                >
                                    {isApplying ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : isUploadingResume ? (
                                        "Uploading..."
                                    ) : (
                                        "Submit Application"
                                    )}
                                </GradientButton>

                                {!resumeUrl && !isUploadingResume && (
                                    <p className="text-xs text-center text-red-400 font-medium animate-pulse">
                                        Please upload your resume to enable submission
                                    </p>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </GlassCard>
        </div>
    );
}
