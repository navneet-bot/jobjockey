"use client";

import { GradientHeader } from "@/components/ui/GradientHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Briefcase, BookOpen, User, Star, TrendingUp, CheckCircle, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/actions/userActions";
import { UserProfile } from "@/lib/schema";

export default function TalentDashboardPage() {
    const [activeTab, setActiveTab] = useState("opportunities");
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserProfile().then((data) => {
            setProfile(data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
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
                    { id: "skills", label: "Skill Upgrade", icon: TrendingUp },
                    { id: "profile", label: "My Profile", icon: User },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all shrink-0 border ${
                            activeTab === tab.id
                                ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30"
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
                                <button className="px-4 py-1.5 rounded-full bg-[var(--primary)] text-black font-medium text-sm">Jobs</button>
                                <button className="px-4 py-1.5 rounded-full text-[var(--text-dim)] hover:text-[var(--text-main)] font-medium text-sm transition-colors">Internships</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Mock Data for Jobs */}
                            {[
                                { title: "Frontend Developer", company: "TechNova", type: "Full Time", location: "Remote", match: "98%" },
                                { title: "UX Designer Intern", company: "CreativeFlow", type: "Internship", location: "New York", match: "85%" },
                                { title: "React Engineer", company: "StartUp Inc.", type: "Full Time", location: "San Francisco", match: "92%" },
                            ].map((job, i) => (
                                <GlassCard key={i} className="p-6 flex flex-col gap-4 group hover:border-[var(--primary)]/40 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center shrink-0">
                                            <Briefcase className="w-6 h-6 text-[#111827] dark:text-white group-hover:text-[var(--primary)] transition-colors" />
                                        </div>
                                        <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">{job.match} Match</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">{job.title}</h4>
                                        <p className="text-[var(--text-dim)] text-sm">{job.company}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-xs text-[var(--text-dim)] bg-[var(--glass-bg)] px-2 py-1 rounded-md border border-[var(--glass-border)]">{job.type}</span>
                                        <span className="text-xs text-[var(--text-dim)] bg-[var(--glass-bg)] px-2 py-1 rounded-md border border-[var(--glass-border)]">{job.location}</span>
                                    </div>
                                    <Button className="w-full mt-2 rounded-full bg-[var(--bg-secondary)] text-[var(--text-main)] hover:bg-[var(--primary)] hover:text-black transition-colors border border-[var(--glass-border)] group-hover:border-[var(--primary)]/50">View Details</Button>
                                </GlassCard>
                            ))}
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
                                        <li key={i} className="flex justify-between items-center group cursor-pointer hover:bg-[var(--glass-bg)] p-2 rounded-lg -mx-2 transition-colors">
                                            <span className="text-[var(--text-dim)] group-hover:text-[var(--text-main)] text-sm">{resource}</span>
                                            <ExternalLink className="w-4 h-4 text-[var(--text-dim)] group-hover:text-[var(--primary)]" />
                                        </li>
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
                                            <Button>Create Profile</Button>
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
