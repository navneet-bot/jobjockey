import { cn } from "@/lib/utils";

interface AIScoreBadgeProps {
    score: number | null | undefined;
    classification: string | null | undefined;
}

export function AIScoreBadge({ score, classification }: AIScoreBadgeProps) {
    if (score === null || score === undefined || !classification) {
        return <span className="text-muted-foreground italic text-xs">Not Analyzed</span>;
    }

    let colorClass = "bg-gray-500/10 text-gray-400 border-gray-500/20";
    
    // Assign colors based on exact classification text or score range
    const lowerClass = classification.toLowerCase();
    
    if (score >= 90 || lowerClass.includes("excellent")) {
        colorClass = "bg-green-500/10 text-green-400 border-green-500/20";
        classification = "Excellent";
    } else if (score >= 75 || lowerClass.includes("strong")) {
        colorClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
        classification = "Strong";
    } else if (score >= 50 || lowerClass.includes("partial")) {
        colorClass = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
        classification = "Partial";
    } else {
        colorClass = "bg-red-500/10 text-red-400 border-red-500/20";
        classification = "Weak";
    }

    return (
        <div className="flex items-center gap-2">
            <span className={cn("px-2.5 py-1 rounded-md text-xs font-bold border", colorClass)}>
                {classification}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
                {score}/100
            </span>
        </div>
    );
}
