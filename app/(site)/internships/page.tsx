import { getInternships } from "@/actions/internshipActions";
import { getPlatformSettings } from "@/actions/adminSettingsActions";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { JobFeed } from "@/components/features/job/JobFeed";
import { GraduationCap, Info } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export const dynamic = "force-dynamic";

export default async function InternshipsPage() {
    const allInternships = await getInternships();
    const settings = await getPlatformSettings();
    const showInternships = settings?.showInternshipsPublicly ?? true;
    
    const internships = allInternships.filter(i => i.isApproved);

    return (
        <div className="flex flex-col gap-10 pb-20">
            <GradientHeader
                title="Launch Your Career"
                subtitle="Gain real-world experience through premium internships at verified companies."
                badge={
                    <>
                        <GraduationCap className="w-5 h-5" />
                        <span>Internships</span>
                    </>
                }
            />

            {!showInternships ? (
                <GlassCard className="p-12 border-dashed flex flex-col items-center justify-center gap-6 text-center max-w-4xl mx-auto w-full">
                    <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                        <Info className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-2xl font-bold text-[var(--text-main)]">Section Currently Unavailable</h4>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            The internships section is currently being updated by the administrator. Please check back later.
                        </p>
                    </div>
                </GlassCard>
            ) : (
                <JobFeed initialJobs={internships} />
            )}
        </div>
    );
}
