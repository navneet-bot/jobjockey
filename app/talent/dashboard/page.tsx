"use client";

import { GradientHeader } from "@/components/ui/GradientHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Briefcase, BookOpen, User, Star, TrendingUp, CheckCircle, ExternalLink, FileText, ClipboardList, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/actions/userActions";
import { getJobs } from "@/actions/jobActions";
import { getInternships } from "@/actions/internshipActions";
import { getMyApplications } from "@/actions/applicationActions";
import { UserProfile, Job, Application, Internship } from "@/lib/schema";

export default function TalentDashboardPage() {
    const [activeTab, setActiveTab] = useState("opportunities");
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [jobs, setJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [appsLoading, setAppsLoading] = useState(true);
    const [jobFilter, setJobFilter] = useState<"job" | "internship">("job");

    useEffect(() => {
        getUserProfile().then((data) => {
            setProfile(data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });

        const fetchOpportunities = async () => {
            try {
                const [allJobs, allInternships] = await Promise.all([
                    getJobs(),
                    getInternships()
                ]);
                
                const combined = [
                    ...allJobs.map(j => ({ ...j, jobCategory: 'job' as const })),
                    ...allInternships.map(i => ({ ...i, jobCategory: 'internship' as const }))
                ];
                
                setJobs(combined);
                setJobsLoading(false);
            } catch (err) {
                console.error(err);
                setJobsLoading(false);
            }
        };

        fetchOpportunities();

        getMyApplications().then((data) => {
            setApplications(data);
            setAppsLoading(false);
        }).catch(err => {
            console.error(err);
            setAppsLoading(false);
        });
    }, []);

    return (
        <div className="flex flex-col gap-8 py-12 px-6 container mx-auto min-h-screen">
            <GradientHeader
                title="Talent Dashboard"
                subtitle="Discover opportunities, upgrade skills, and manage your profile."
                align="left"
            />

            {/* Dashboard Navigation */}
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {[
                    { id: "opportunities", label: "Opportunities", icon: Briefcase },
                    { id: "applications", label: "My Applications", icon: ClipboardList },
                    { id: "skills", label: "Skill Upgrade", icon: TrendingUp },
                    { id: "profile", label: "My Profile", icon: User },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all shrink-0 border ${
                            activeTab === tab.id
                                ? "bg-[#111827] text-white border-[#111827] dark:bg-white dark:text-black dark:border-white"
                                : "bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-dim)] hover:text-[var(--text-main)] hover:border-[var(--primary)]/50"
                        }`}
                    >
                        <tab.icon className="w-5 h-5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* DASHBOARD CONTENT */}
            <div className="mt-4">
                {activeTab === "opportunities" && (
                    <div className="flex flex-col gap-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-[var(--text-main)]">Recommended for You</h3>
                            <div className="flex gap-2 bg-[var(--glass-bg)] p-1 rounded-full border border-[var(--glass-border)]">
                                <button 
                                    onClick={() => setJobFilter("job")}
                                    className={`px-4 py-1.5 rounded-full font-medium text-sm transition-all ${jobFilter === "job" ? "bg-[var(--primary)] text-black" : "text-[var(--text-dim)] hover:text-[var(--text-main)]"}`}
                                >
                                    Jobs
                                </button>
                                <button 
                                    onClick={() => setJobFilter("internship")}
                                    className={`px-4 py-1.5 rounded-full font-medium text-sm transition-all ${jobFilter === "internship" ? "bg-[var(--primary)] text-black" : "text-[var(--text-dim)] hover:text-[var(--text-main)]"}`}
                                >
                                    Internships
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobsLoading ? (
                                <div className="col-span-full py-10 text-center text-[var(--text-dim)]">Loading opportunities...</div>
                            ) : jobs.filter(j => j.jobCategory === jobFilter).length === 0 ? (
                                <div className="col-span-full py-10 text-center text-[var(--text-dim)]">No {jobFilter}s available at the moment.</div>
                            ) : (
                                jobs.filter(j => j.jobCategory === jobFilter).map((job) => (
                                    <Link href={job.jobCategory === 'internship' ? `/internships/${job.id}` : `/jobs/${job.id}`} key={job.id}>
                                        <GlassCard className="p-6 flex flex-col h-full gap-4 group hover:border-[var(--primary)]/40 transition-all cursor-pointer">
                                            <div className="flex justify-between items-start">
                                                <div className="w-12 h-12 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center shrink-0">
                                                    <Briefcase className="w-6 h-6 text-[#111827] dark:text-white group-hover:text-[var(--primary)] transition-colors" />
                                                </div>
                                                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">90% Match</span>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors line-clamp-1">{job.title}</h4>
                                                <p className="text-[var(--text-dim)] text-sm">{job.company}</p>
                                            </div>
                                            <div className="flex gap-2 mt-auto">
                                                <span className="text-xs text-[var(--text-dim)] bg-[var(--glass-bg)] px-2 py-1 rounded-md border border-[var(--glass-border)]">{job.jobType}</span>
                                                <span className="text-xs text-[var(--text-dim)] bg-[var(--glass-bg)] px-2 py-1 rounded-md border border-[var(--glass-border)] line-clamp-1">{job.location}</span>
                                            </div>
                                            <Button className="w-full mt-2 rounded-full bg-[var(--bg-secondary)] text-[var(--text-main)] hover:bg-[var(--primary)] hover:text-black transition-colors border border-[var(--glass-border)] group-hover:border-[var(--primary)]/50">View Details</Button>
                                        </GlassCard>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "applications" && (
                    <div className="flex flex-col gap-8">
                        <div>
                            <h3 className="text-2xl font-bold text-[var(--text-main)] mb-2">My Applications</h3>
                            <p className="text-[var(--text-dim)]">Track the status of your submitted job and internship applications.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {appsLoading ? (
                                <div className="py-10 text-center text-[var(--text-dim)]">Loading your applications...</div>
                            ) : applications.length === 0 ? (
                                <GlassCard className="p-8 text-center flex flex-col items-center gap-4">
                                    <ClipboardList className="w-12 h-12 text-[var(--text-dim)]" />
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-lg font-bold text-[var(--text-main)]">No applications yet</h4>
                                        <p className="text-[var(--text-dim)]">You haven't applied to any opportunities. Start exploring!</p>
                                    </div>
                                    <Button onClick={() => setActiveTab("opportunities")} className="rounded-full bg-[#111827] text-white dark:bg-white dark:text-black hover:bg-[#111827]/90 dark:hover:bg-white/90">Browse Opportunities</Button>
                                </GlassCard>
                            ) : (
                                 applications.map((app) => {
                                    const jobOrInternship = app.job || app.internship;
                                    const isInternship = !!app.internship;
                                    const detailHref = isInternship ? `/internships/${jobOrInternship?.id}` : `/jobs/${jobOrInternship?.id}`;

                                    return (
                                        <GlassCard key={app.application.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[var(--primary)]/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center shrink-0">
                                                    {isInternship ? (
                                                        <GraduationCap className="w-6 h-6 text-[var(--text-main)]" />
                                                    ) : (
                                                        <Briefcase className="w-6 h-6 text-[var(--text-main)]" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <h4 className="font-bold text-[var(--text-main)]">{jobOrInternship?.title || "Deleted Position"}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-[var(--text-dim)]">{jobOrInternship?.company || "Unknown Company"}</span>
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[var(--text-dim)]">
                                                            {isInternship ? "Internship" : "Job"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 md:gap-10">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] font-bold">Applied On</span>
                                                    <span className="text-sm text-[var(--text-main)]">{new Date(app.application.appliedAt).toLocaleDateString()}</span>
                                                </div>

                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] font-bold">Status</span>
                                                    <span className={`text-sm font-bold px-3 py-1 rounded-full border ${
                                                        app.application.status === 'selected' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                        app.application.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                        app.application.status === 'interview' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                        app.application.status === 'shortlisted' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                        'bg-[var(--glass-bg)] text-[var(--text-dim)] border-[var(--glass-border)]'
                                                    }`}>
                                                        {app.application.status.charAt(0).toUpperCase() + app.application.status.slice(1)}
                                                    </span>
                                                </div>

                                                <Link href={detailHref}>
                                                    <Button variant="outline" size="sm" className="rounded-full">View Details</Button>
                                                </Link>
                                            </div>
                                        </GlassCard>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "skills" && (
                    <div className="flex flex-col gap-8">
                        <div>
                            <h3 className="text-2xl font-bold text-[var(--text-main)] mb-2">Skill Upgrade</h3>
                            <p className="text-[var(--text-dim)]">Level up your profile to increase your match percentage with top companies.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <GlassCard className="p-6">
                                <h4 className="flex items-center gap-2 text-lg font-bold text-[var(--text-main)] mb-4"><Star className="w-5 h-5 text-yellow-500" /> Recommended Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {["TypeScript", "Next.js", "Docker", "AWS", "GraphQL"].map(skill => (
                                        <span key={skill} className="px-3 py-1.5 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-[var(--text-main)] hover:border-[var(--primary)]/50 transition-colors cursor-pointer">{skill} <span className="text-[var(--primary)] ml-1">+</span></span>
                                    ))}
                                </div>
                            </GlassCard>

                            <GlassCard className="p-6">
                                <h4 className="flex items-center gap-2 text-lg font-bold text-[var(--text-main)] mb-4"><BookOpen className="w-5 h-5 text-blue-500" /> Learning Resources</h4>
                                <ul className="flex flex-col gap-3">
                                    {[
                                        "Advanced React Patterns Course",
                                        "System Design Interview Prep",
                                        "Mastering Taildwind CSS"
                                    ].map((resource, i) => (
                                        <Link href="/courses" key={i}>
                                            <li className="flex justify-between items-center group cursor-pointer hover:bg-[var(--glass-bg)] p-2 rounded-lg -mx-2 transition-colors">
                                                <span className="text-[var(--text-dim)] group-hover:text-[var(--text-main)] text-sm">{resource}</span>
                                                <ExternalLink className="w-4 h-4 text-[var(--text-dim)] group-hover:text-[var(--primary)]" />
                                            </li>
                                        </Link>
                                    ))}
                                </ul>
                            </GlassCard>
                        </div>
                    </div>
                )}

                {activeTab === "profile" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <GlassCard className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-[var(--text-main)]">Profile Details</h3>
                                    <Link href="/talent/create-profile">
                                        <Button variant="outline" size="sm" className="rounded-full">
                                            {profile ? "Edit Profile" : "Create Profile"}
                                        </Button>
                                    </Link>
                                </div>
                                
                                {loading ? (
                                    <div className="flex justify-center py-10">
                                        <span className="text-[var(--text-dim)]">Loading profile...</span>
                                    </div>
                                ) : profile ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-[var(--text-dim)] uppercase tracking-wider font-bold">Full Name</span>
                                            <span className="text-[var(--text-main)]">{profile.name || "N/A"}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-[var(--text-dim)] uppercase tracking-wider font-bold">Email</span>
                                            <span className="text-[var(--text-main)]">{profile.email || "N/A"}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-[var(--text-dim)] uppercase tracking-wider font-bold">Phone</span>
                                            <span className="text-[var(--text-main)]">{profile.phone || "N/A"}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-[var(--text-dim)] uppercase tracking-wider font-bold">Education</span>
                                            <span className="text-[var(--text-main)]">{profile.education || "N/A"}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-[var(--text-dim)] uppercase tracking-wider font-bold">Experience</span>
                                            <span className="text-[var(--text-main)]">{profile.experience || "N/A"}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-[var(--text-dim)] uppercase tracking-wider font-bold">Preferred Roles</span>
                                            <span className="text-[var(--text-main)]">
                                                {profile.preferredJobType || "N/A"}
                                                {profile.preferredDomain ? `, ${profile.preferredDomain}` : ""}
                                            </span>
                                        </div>
                                        <div className="col-span-full flex flex-col gap-1">
                                            <span className="text-xs text-[var(--text-dim)] uppercase tracking-wider font-bold">Skills</span>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {profile.skills ? profile.skills.split(',').map((s: string) => (
                                                    <span key={s.trim()} className="px-2 py-1 text-xs rounded bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-dim)]">
                                                        {s.trim()}
                                                    </span>
                                                )) : <span className="text-[var(--text-dim)] italic">No skills added</span>}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                                        <span className="text-[var(--text-dim)]">No profile found.</span>
                                        <Link href="/talent/create-profile">
                                            <Button className="bg-[#111827] text-white dark:bg-white dark:text-black hover:bg-[#111827]/90 dark:hover:bg-white/90 rounded-full">Create Profile</Button>
                                        </Link>
                                    </div>
                                )}
                            </GlassCard>
                        </div>

                        <div className="flex flex-col gap-6">
                            <GlassCard className="p-6 flex flex-col gap-4">
                                <h4 className="font-bold text-[var(--text-main)] flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Profile Completion</h4>
                                <div className="h-2 w-full bg-[var(--glass-bg)] rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[85%]"></div>
                                </div>
                                <p className="text-xs text-[var(--text-dim)]">Your profile is looking great! Add your portfolio to reach 100%.</p>
                            </GlassCard>

                            <GlassCard className="p-6 flex flex-col gap-4">
                                <h4 className="font-bold text-[var(--text-main)] flex items-center gap-2"><FileText className="w-5 h-5" /> Resume</h4>
                                <div className="p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex justify-between items-center group hover:border-[var(--primary)]/50 transition-colors">
                                    <div 
                                        className={`flex items-center gap-3 ${profile?.resumeUrl ? 'cursor-pointer' : ''}`}
                                        onClick={() => profile?.resumeUrl && window.open(profile.resumeUrl, "_blank")}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold text-red-500">PDF</span>
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm font-medium text-[var(--text-main)] group-hover:text-[var(--primary)] truncate max-w-[200px] md:max-w-xs">
                                                {loading ? "Loading..." : profile?.resumeUrl ? profile.resumeUrl.split('/').pop() : "No resume uploaded"}
                                            </span>
                                            <span className="text-xs text-[var(--text-dim)]">
                                                {profile?.resumeUrl ? "Click to view" : ""}
                                            </span>
                                        </div>
                                    </div>
                                    <Link href="/talent/create-profile">
                                        <Button variant="ghost" size="sm" className="rounded-full">Update</Button>
                                    </Link>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
