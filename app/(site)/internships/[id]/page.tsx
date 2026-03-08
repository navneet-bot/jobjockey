import { getSingleInternship } from "@/actions/internshipActions";
import { getUserProfile } from "@/actions/userActions";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { StickyApplyBar } from "@/components/ui/StickyApplyBar";
import { MapPin, Briefcase, GraduationCap, Building2, Calendar, Clock, Info, CheckCircle2, Star, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface InternshipPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: InternshipPageProps): Promise<Metadata> {
    return {
        title: "JobJockey - Internship Details",
    };
}

export default async function InternshipPage({ params }: InternshipPageProps) {
    const { id } = await params;
    const internship = await getSingleInternship(id);
    const profile = await getUserProfile();

    if (!internship) {
        return notFound();
    }

    return (
        <div className="flex flex-col gap-8 pb-32">
            <GradientHeader
                title={internship.title}
                subtitle={`At ${internship.company}`}
                badge="INTERNSHIP"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 relative">
                <aside className="lg:col-span-1 flex flex-col gap-6 sticky top-24 h-fit">
                    <GlassCard className="flex flex-col gap-4 items-center text-center">
                        <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center border border-border shadow-[0_0_20px_var(--primary-glow)]">
                            <Building2 className="text-muted-foreground w-10 h-10" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground">{internship.company}</h3>
                        </div>
                        <div className="w-full h-px bg-[var(--glass-border)] my-2" />
                        <div className="w-full flex-col flex gap-3 text-sm text-[#111827]/70 dark:text-muted-foreground text-left">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                                {internship.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                                {internship.duration || "Flexible Duration"}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                                {internship.workMode || "On-site"}
                            </div>
                            {internship.joiningDate && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                                    Join: {internship.joiningDate}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                                Posted {formatDistanceToNow(new Date(internship.postedAt))} ago
                            </div>
                            {internship.department && (
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                                    {internship.department}
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </aside>

                <section className="lg:col-span-2 flex flex-col gap-8">
                    <GlassCard className="prose dark:prose-invert max-w-none">
                        <div className="flex items-center gap-2 mb-4 text-[#111827] dark:text-white">
                            <Info className="w-6 h-6 text-[var(--primary)]" />
                            <h3 className="text-2xl font-bold m-0">Internship Overview</h3>
                        </div>
                        <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed text-base">
                            {internship.description}
                        </div>
                    </GlassCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {internship.whatWillLearn && (
                            <GlassCard className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-[#111827] dark:text-white">
                                    <GraduationCap className="w-6 h-6 text-[var(--primary)]" />
                                    <h3 className="text-xl font-bold">What You Will Learn</h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{internship.whatWillLearn}</p>
                            </GlassCard>
                        )}
                        {internship.projectsAndTasks && (
                            <GlassCard className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-[#111827] dark:text-white">
                                    <Briefcase className="w-6 h-6 text-[var(--primary)]" />
                                    <h3 className="text-xl font-bold">Projects & Tasks</h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{internship.projectsAndTasks}</p>
                            </GlassCard>
                        )}
                    </div>

                    <GlassCard className="flex flex-col gap-6">
                        <div className="flex items-center gap-2 text-[#111827] dark:text-white">
                            <Users className="w-6 h-6 text-[var(--primary)]" />
                            <h3 className="text-xl font-bold">Skills & Education</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-3">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">Required Skills</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{internship.requiredSkills}</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Education Requirements</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap opacity-80">
                                    {internship.educationLevel || "Open to all students"}
                                    {internship.eligibleCourses && <><br /><span className="text-xs italic">Courses: {internship.eligibleCourses}</span></>}
                                </p>
                            </div>
                        </div>
                    </GlassCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GlassCard className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-[#111827] dark:text-white">
                                <Star className="w-6 h-6 text-[var(--primary)]" />
                                <h3 className="text-xl font-bold">Benefits & Perks</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { label: "Completion Certificate", value: internship.certificateProvided },
                                    { label: "Letter of Recommendation", value: internship.letterOfRecProvided },
                                    { label: "PPO Opportunity", value: internship.ppoPossibility },
                                    { label: "Direct Mentorship", value: internship.mentorshipProvided },
                                    { label: "Skill Training", value: internship.trainingProvided },
                                ].map((item, i) => item.value && (
                                    <div key={i} className="flex items-center gap-3 text-sm text-[var(--text-main)]">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </GlassCard>

                        <GlassCard className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-[#111827] dark:text-white">
                                <Calendar className="w-6 h-6 text-[var(--primary)]" />
                                <h3 className="text-xl font-bold">Application Details</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Stipend:</span>
                                    <span className="font-bold text-[var(--primary)]">{internship.stipend || "Unpaid"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Openings:</span>
                                    <span className="font-medium">{internship.openPositions || "Not specified"}</span>
                                </div>
                                <div className="flex justify-between text-sm p-2 rounded-lg bg-red-500/5 text-red-500 font-bold border border-red-500/10">
                                    <span>Deadline:</span>
                                    <span>{internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </section>
            </div>

            <StickyApplyBar jobId={internship.id} category="internship" salary={internship.stipend} initialResumeUrl={profile?.resumeUrl} />
        </div>
    );
}
