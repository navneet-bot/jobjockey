import { getSingleJob } from "@/actions/jobActions";
import { getUserProfile } from "@/actions/userActions";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { StickyApplyBar } from "@/components/ui/StickyApplyBar";
import { MapPin, Briefcase, GraduationCap, Building2, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface JobPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
    return {
        title: "JobJockey - Job Details",
    };
}

export default async function JobPage({ params }: JobPageProps) {
    const { id } = await params;
    const job = await getSingleJob(id);
    const profile = await getUserProfile();

    if (!job) {
        return notFound();
    }

    return (
        <div className="flex flex-col gap-8 pb-32">
            <GradientHeader
                title={job.title}
                subtitle={`At ${job.company}`}
                badge={job.jobCategory.toUpperCase()}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 relative">
                {/* Left Col - Company Profile / Quick Details */}
                <aside className="lg:col-span-1 flex flex-col gap-6 sticky top-24 h-fit">
                    <GlassCard className="flex flex-col gap-4 items-center text-center">
                        <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center border border-border shadow-[0_0_20px_var(--primary-glow)]">
                            <Building2 className="text-muted-foreground w-10 h-10" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground">{job.company}</h3>
                        </div>
                        <div className="w-full h-px bg-[var(--glass-border)] my-2" />
                        <div className="w-full flex-col flex gap-3 text-sm text-[#111827]/70 dark:text-muted-foreground text-left">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                                {job.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                                {job.jobType}
                            </div>
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                                {job.experienceLevel}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                                Posted {formatDistanceToNow(new Date(job.postedAt))} ago
                            </div>
                        </div>
                    </GlassCard>
                </aside>

                {/* Right Col - Full Description */}
                <section className="lg:col-span-2 flex flex-col gap-6">
                    <GlassCard className="prose dark:prose-invert max-w-none prose-headings:text-[#111827] dark:prose-headings:text-white prose-a:text-[var(--primary)] text-[#111827]/80 dark:text-gray-300">
                        <h3 className="text-2xl font-semibold mb-4 text-[#111827] dark:text-white">Job Description</h3>
                        <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                            {job.description}
                        </div>
                    </GlassCard>
                </section>
            </div>

            <StickyApplyBar jobId={job.id} salary={job.salary} initialResumeUrl={profile?.resumeUrl} />
        </div>
    );
}
