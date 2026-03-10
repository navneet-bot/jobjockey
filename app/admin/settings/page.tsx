import { GradientHeader } from "@/components/ui/GradientHeader";
import { getPlatformSettings } from "@/actions/adminSettingsActions";
import { SettingsForm } from "./SettingsForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { Info } from "lucide-react";

export default async function AdminSettingsPage() {
    const settings = await getPlatformSettings();

    if (!settings) {
        return (
            <div className="flex flex-col gap-10">
                <GradientHeader
                    align="left"
                    title="Admin Settings"
                    subtitle="Configure platform preferences and administrative controls."
                />
                <GlassCard className="p-12 text-center text-destructive">
                    Failed to load platform settings. Please try again.
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 pb-20">
            <GradientHeader
                align="left"
                title="Admin Settings"
                subtitle="Configure platform preferences and administrative controls."
            />

            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/20 rounded-2xl p-6 flex items-start gap-4 mb-2">
                <div className="p-2 bg-black/10 dark:bg-white/10 rounded-lg text-[#111827] dark:text-white">
                    <Info className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-[#111827] dark:text-white">Platform Configuration</h4>
                    <p className="text-sm text-[var(--text-dim)] max-w-2xl">
                        These settings directly control the core behavior of the Job Jockey platform. 
                        Changes made here will be reflected instantly for all companies and users.
                    </p>
                </div>
            </div>

            <SettingsForm initialData={settings} />
        </div>
    );
}
