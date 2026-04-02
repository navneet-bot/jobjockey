import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Loader2, FileText, Github, Globe, Linkedin, BrainCircuit } from "lucide-react";

interface AIProcessingModalProps {
    isOpen: boolean;
}

const steps = [
    { icon: FileText, label: "Extracting resume data", delay: "0s" },
    { icon: Github, label: "Analyzing GitHub profiles", delay: "0.15s" },
    { icon: Globe, label: "Scanning portfolios", delay: "0.3s" },
    { icon: Linkedin, label: "Checking LinkedIn data", delay: "0.45s" },
    { icon: BrainCircuit, label: "Running AI evaluation", delay: "0.6s" },
];

export function AIProcessingModal({ isOpen }: AIProcessingModalProps) {
    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-[#111726] border-[var(--glass-border)] text-[var(--text-main)] shadow-2xl p-6 flex flex-col items-center justify-center gap-5 text-center">
                <DialogHeader className="w-full">
                    <DialogTitle className="text-xl font-bold flex justify-center text-black dark:text-[var(--primary)] text-center">
                        AI Analysis
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-700 dark:text-muted-foreground mt-2 font-medium">
                        Analyzing resumes, GitHub profiles, portfolios, and LinkedIn data to score and rank all candidates. This may take a few moments.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="py-4 flex flex-col items-center gap-4 w-full">
                    <Loader2 className="w-12 h-12 text-black dark:text-[var(--primary)] animate-spin" />
                    
                    <div className="flex flex-col gap-2 w-full max-w-xs">
                        {steps.map((step, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse"
                                style={{ animationDelay: step.delay, animationDuration: "2s" }}
                            >
                                <step.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-xs font-medium text-muted-foreground">{step.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
