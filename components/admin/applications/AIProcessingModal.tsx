import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface AIProcessingModalProps {
    isOpen: boolean;
}

export function AIProcessingModal({ isOpen }: AIProcessingModalProps) {
    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-[#111726] border-[var(--glass-border)] text-[var(--text-main)] shadow-2xl p-6 flex flex-col items-center justify-center gap-4 text-center">
                <DialogHeader className="w-full">
                    <DialogTitle className="text-xl font-bold flex justify-center text-black dark:text-[var(--primary)] text-center">Analyzing Resumes</DialogTitle>
                    <DialogDescription className="text-center text-gray-700 dark:text-muted-foreground mt-2 font-medium">
                        Please wait while AI analyzes and ranks all candidates for this job based on their qualifications. This might take a few moments.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="py-8">
                    <Loader2 className="w-16 h-16 text-[var(--primary)] animate-spin" />
                </div>
            </DialogContent>
        </Dialog>
    );
}
