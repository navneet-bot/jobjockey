import { getSingleJob } from "@/actions/jobActions";
import { getUserProfile } from "@/actions/userActions";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { StickyApplyBar } from "@/components/ui/StickyApplyBar";
import { MapPin, Briefcase, GraduationCap, Building2, Calendar, Currency, Clock, Star, ListChecks, Wrench, GraduationCap as EducationIcon, Info, Users, CheckCircle2 } from "lucide-react";
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
                                <Clock className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                                {job.workMode}
                            </div>
                            {job.duration && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                                    {job.duration}
                                </div>
                            )}
                            {job.joiningDate && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                                    Join: {job.joiningDate}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                                Posted {formatDistanceToNow(new Date(job.postedAt))} ago
                            </div>
                            {job.department && (
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                                    {job.department}
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </aside>

                {/* Right Col - Full Description & Details */}
                <section className="lg:col-span-2 flex flex-col gap-8">
                    {/* Main Description */}
                    <GlassCard className="prose dark:prose-invert max-w-none">
                        <div className="flex items-center gap-2 mb-4 text-[#111827] dark:text-white">
                            <Info className="w-6 h-6 text-[var(--primary)]" />
                            <h3 className="text-2xl font-bold m-0">{job.jobCategory === 'internship' ? 'Internship Overview' : 'Job Description'}</h3>
                        </div>
                        <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                            {job.description}
                        </div>
                    </GlassCard>

                    {/* Roles & Responsibilities */}
                    {job.responsibilities && (
                        <GlassCard className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-[#111827] dark:text-white">
                                <ListChecks className="w-6 h-6 text-[var(--primary)]" />
                                <h3 className="text-xl font-bold">Key Responsibilities</h3>
                            </div>
                            <div className="whitespace-pre-wrap text-muted-foreground text-sm leading-relaxed">
                                {job.responsibilities}
                            </div>
                        </GlassCard>
                    )}

                    {/* Internship Specifics */}
                    {job.jobCategory === 'internship' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {job.whatWillLearn && (
                                <GlassCard className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2 text-[#111827] dark:text-white">
                                        <GraduationCap className="w-5 h-5 text-[var(--primary)]" />
                                        <h4 className="font-bold">What You Will Learn</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{job.whatWillLearn}</p>
                                </GlassCard>
                            )}
                            {job.projectsAndTasks && (
                                <GlassCard className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2 text-[#111827] dark:text-white">
                                        <Briefcase className="w-5 h-5 text-[var(--primary)]" />
                                        <h4 className="font-bold">Projects & Tasks</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{job.projectsAndTasks}</p>
                                </GlassCard>
                            )}
                        </div>
                    )}

                    {/* Skills & Requirements */}
                    <GlassCard className="flex flex-col gap-6">
                        <div className="flex items-center gap-2 text-[#111827] dark:text-white">
                            <Wrench className="w-6 h-6 text-[var(--primary)]" />
                            <h3 className="text-xl font-bold">Skills & Requirements</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-3">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">Required Skills</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {job.requiredSkills}
                                </p>
                            </div>
                            {job.preferredSkills && (
                                <div className="flex flex-col gap-3">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Preferred Skills</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap opacity-70">
                                        {job.preferredSkills}
                                    </p>
                                </div>
                            )}
                        </div>

                        {(job.minEducation || job.toolsAndTechnologies || job.certifications) && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[var(--glass-border)]">
                                {job.minEducation && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted-foreground uppercase">Education</span>
                                        <span className="text-sm font-medium text-[var(--text-main)]">{job.minEducation}</span>
                                    </div>
                                )}
                                {job.toolsAndTechnologies && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted-foreground uppercase">Tools</span>
                                        <span className="text-sm font-medium text-[var(--text-main)]">{job.toolsAndTechnologies}</span>
                                    </div>
                                )}
                                {job.certifications && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted-foreground uppercase">Certifications</span>
                                        <span className="text-sm font-medium text-[var(--text-main)]">{job.certifications}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </GlassCard>

                    {/* Experience & Salary Scope */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GlassCard className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-[#111827] dark:text-white">
                                <Clock className="w-6 h-6 text-[var(--primary)]" />
                                <h3 className="text-xl font-bold">Experience Required</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Level:</span>
                                    <span className="font-medium text-[var(--text-main)]">{job.experienceLevel}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Exp Range:</span>
                                    <span className="font-medium text-[var(--text-main)]">
                                        {job.minExperience && job.maxExperience 
                                            ? `${job.minExperience} - ${job.maxExperience} Years`
                                            : job.minExperience ? `${job.minExperience}+ Years` : 'Not specified'}
                                    </span>
                                </div>
                                {job.industryExperience && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Industry:</span>
                                        <span className="font-medium text-[var(--text-main)]">{job.industryExperience}</span>
                                    </div>
                                )}
                            </div>
                        </GlassCard>

                        <GlassCard className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-[#111827] dark:text-white">
                                <Currency className="w-6 h-6 text-[var(--primary)]" />
                                <h3 className="text-xl font-bold">Compensation</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Type:</span>
                                    <span className="font-medium text-[var(--text-main)]">{job.compensationType || (job.jobCategory === 'internship' ? 'Stipend' : 'Salary')}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-center">
                                    <span className="text-lg font-bold text-[var(--text-main)]">{job.salary || "Negotiable"}</span>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Hiring Process & Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GlassCard className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-[#111827] dark:text-white">
                                <Users className="w-6 h-6 text-[var(--primary)]" />
                                <h3 className="text-xl font-bold">Hiring Process</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Selection Process:</span>
                                    <span className="font-medium text-[var(--text-main)]">{job.selectionProcess || "Not specified"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Interview Rounds:</span>
                                    <span className="font-medium text-[var(--text-main)]">{job.interviewRounds || "1"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Interview Mode:</span>
                                    <span className="font-medium text-[var(--text-main)]">{job.interviewMode || "Online"}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-2 p-2 rounded-lg bg-red-500/5 text-red-500 font-bold border border-red-500/10">
                                    <span>Deadline:</span>
                                    <span>{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-[#111827] dark:text-white">
                                <Star className="w-6 h-6 text-[var(--primary)]" />
                                <h3 className="text-xl font-bold">Perks & Benefits</h3>
                            </div>
                            {job.jobCategory === 'internship' ? (
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { label: "Certificate", value: job.certificateProvided },
                                        { label: "Letter of Recommendation", value: job.letterOfRecProvided },
                                        { label: "PPO Opportunity", value: job.ppoPossibility },
                                        { label: "Mentorship", value: job.mentorshipProvided },
                                        { label: "Training", value: job.trainingProvided },
                                    ].map((item, i) => item.value && (
                                        <div key={i} className="flex items-center gap-2 text-sm text-[var(--text-main)]">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            {item.label}
                                        </div>
                                    ))}
                                    {!job.certificateProvided && !job.letterOfRecProvided && !job.ppoPossibility && (
                                        <p className="text-sm text-muted-foreground italic">Standard industry perks apply.</p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {job.perksAndBenefits || "Competitive compensation, growth opportunities, and a vibrant work culture."}
                                </p>
                            )}
                        </GlassCard>
                    </div>

                    {/* Additional Info */}
                    {job.specialInstructions && (
                        <GlassCard className="bg-yellow-500/5 border-yellow-500/20">
                            <h4 className="text-sm font-bold text-yellow-600 dark:text-yellow-400 mb-2 flex items-center gap-2">
                                <Info className="w-4 h-4" /> Special Instructions
                            </h4>
                            <p className="text-sm text-muted-foreground italic leading-relaxed">{job.specialInstructions}</p>
                        </GlassCard>
                    )}
                </section>
            </div>

            <StickyApplyBar jobId={job.id} salary={job.salary} initialResumeUrl={profile?.resumeUrl} />
        </div>
    );
}
