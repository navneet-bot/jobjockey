import { GlassCard } from "@/components/ui/GlassCard";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="flex flex-col gap-10">
            <GradientHeader
                align="left"
                title="Admin Settings"
                subtitle="Configure platform preferences and administrative controls."
            />

            <GlassCard className="p-12 border-dashed flex flex-col items-center justify-center gap-6 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                    <Settings className="w-10 h-10 text-muted-foreground animate-[spin_8s_linear_infinite]" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-[var(--text-main)]">Coming Soon</h4>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        We are currently refining the administrative settings. New configuration options for platform controls and user management will be available here soon.
                    </p>
                </div>
            </GlassCard>
        </div>
    );
}
