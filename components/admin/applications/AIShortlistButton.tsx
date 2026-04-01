"use client";

import { Button } from "@/components/ui/button";
import { BrainCircuit, Loader2 } from "lucide-react";
import { useState } from "react";
import { runAIAnalysis } from "@/actions/aiActions";
import { toast } from "sonner";
import { AIProcessingModal } from "./AIProcessingModal";

interface AIShortlistButtonProps {
    jobId: string;
    isInternship?: boolean;
    onComplete: () => void;
}

export function AIShortlistButton({ jobId, isInternship = false, onComplete }: AIShortlistButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleAIAssessment = async () => {
        setLoading(true);
        try {
            const result = await runAIAnalysis(jobId, isInternship);
            if (result.success) {
                toast.success("AI Analysis completed successfully!");
                onComplete();
            } else {
                toast.error(result.error || "AI Analysis failed to complete.");
            }
        } catch (error: any) {
            toast.error(error.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button 
                onClick={handleAIAssessment} 
                disabled={loading}
                className="h-12 px-8 gap-3 bg-[#111827] dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 font-bold text-base rounded-2xl border-none shadow-xl transition-all duration-300"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="size-5" />}
                {loading ? "Analyzing..." : "AI Shortlist"}
            </Button>
            
            <AIProcessingModal isOpen={loading} />
        </>
    );
}
