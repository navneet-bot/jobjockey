import { CheckCircle2, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface SkillMatchCardProps {
    matchedSkillsRaw: string | null | undefined;
}

export function SkillMatchCard({ matchedSkillsRaw }: SkillMatchCardProps) {
    if (!matchedSkillsRaw) return null;

    let skills: { name: string, matched: boolean }[] = [];
    
    try {
        // Try parsing JSON if stored as array or objects
        const parsed = JSON.parse(matchedSkillsRaw);
        if (Array.isArray(parsed)) {
            // Assume array of strings (all matched) or array of objects {name, matched}
            if (typeof parsed[0] === "string") {
                skills = parsed.map(s => ({ name: s, matched: true }));
            } else if (parsed[0].name !== undefined) {
                skills = parsed;
            }
        }
    } catch (e) {
        // If it's a comma separated string: "React (matched), Node (missing)"
        const parts = matchedSkillsRaw.split(',');
        skills = parts.map(s => {
            const clean = s.trim();
            const matched = !clean.toLowerCase().includes("missing") && !clean.toLowerCase().includes("not matched");
            return {
                name: clean.replace(/\(matched\)|\(missing\)|\(not matched\)/ig, "").trim(),
                matched
            };
        });
    }

    if (skills.length === 0) return null;

    return (
        <GlassCard className="p-4 bg-white border-indigo-50 dark:bg-zinc-950/80 dark:border-white/5">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Matched Skills</h4>
            <div className="grid grid-cols-2 gap-2">
                {skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        {skill.matched ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${skill.matched ? 'text-[var(--text-main)] font-medium' : 'text-muted-foreground'}`}>
                            {skill.name}
                        </span>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
