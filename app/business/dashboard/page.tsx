"use client";

import { GradientHeader } from "@/components/ui/GradientHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Briefcase, FileText, CheckCircle, BarChart, Settings, PlusCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getBusinessDashboardStats } from "@/actions/dashboardActions";
import { getCompanyProfile, updateCompanyProfile, CompanyProfileData } from "@/actions/userActions";
import { getMyJobs } from "@/actions/jobActions";
import { Job } from "@/lib/schema";
import { toast } from "sonner";
import JobCard from "@/components/features/job/JobCard";

export default function BusinessDashboardPage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState({ activeJobs: 0, totalApplications: 0, shortlisted: 0 });
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [profile, setProfile] = useState<CompanyProfileData>({ 
        companyName: "", 
        industry: "", 
        companyWebsite: "", 
        description: "",
        contactPerson: "",
        email: "",
        phone: "",
        companySize: "",
        gstNumber: "",
        hiringNeeds: ""
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    const calculateCompletion = () => {
        const fields = [
            profile.companyName,
            profile.industry,
            profile.companyWebsite,
            profile.description,
            profile.contactPerson,
            profile.email,
            profile.phone,
            profile.companySize,
            profile.gstNumber,
            profile.hiringNeeds
        ];
        const filled = fields.filter(f => f && f.trim() !== "").length;
        return Math.round((filled / fields.length) * 100);
    };

    useEffect(() => {
        let mounted = true;
        const loadData = async () => {
            const data = await getBusinessDashboardStats();
            const profileData = await getCompanyProfile();
            const jobData = await getMyJobs();
            if (mounted) {
                setStats(data);
                setJobs(jobData as Job[]);
                setLoadingJobs(false);
                if (profileData) {
                    setProfile({
                        companyName: profileData.companyName || "",
                        industry: profileData.industry || "",
                        companyWebsite: profileData.companyWebsite || "",
                        description: profileData.description || "",
                        contactPerson: profileData.contactPerson || "",
                        email: profileData.email || "",
                        phone: profileData.phone || "",
                        companySize: profileData.companySize || "",
                        gstNumber: profileData.gstNumber || "",
                        hiringNeeds: profileData.hiringNeeds || "",
                    });
                }
            }
        };
        loadData();
        return () => { mounted = false; };
    }, []);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        const res = await updateCompanyProfile(profile);
        setIsSaving(false);
        if (res.success) {
            toast.success("Profile updated successfully!");
            setIsEditingProfile(false);
        } else {
            toast.error(res.error || "Failed to update profile.");
        }
    };

    return (
        <div className="flex flex-col gap-8 py-12 px-6 container mx-auto min-h-screen">
            <GradientHeader
                title="Business Dashboard"
                subtitle="Manage your jobs, view applications, and find top talent."
                align="left"
            />

            {/* Dashboard Navigation */}
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {[
                    { id: "overview", label: "Overview", icon: BarChart },
                    { id: "jobs", label: "Manage Jobs", icon: Briefcase },
                    { id: "applications", label: "Applications", icon: FileText },
                    { id: "profile", label: "Company Profile", icon: Settings },
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
                {activeTab === "overview" && (
                    <div className="flex flex-col gap-8">
                        <div className="flex justify-between items-center bg-[var(--glass-bg)] p-6 rounded-2xl border border-[var(--glass-border)]">
                            <div>
                                <h3 className="text-xl font-bold text-[var(--text-main)]">Ready to hire?</h3>
                                <p className="text-[var(--text-dim)]">Create a new job posting to attract the right talent.</p>
                            </div>
                            <Link href="/business/post-job">
                                <Button className="rounded-full bg-[#111827] text-white dark:bg-white dark:text-black hover:bg-[#111827]/90 dark:hover:bg-white/90 font-bold flex items-center gap-2" size="lg">
                                    <PlusCircle className="w-5 h-5" />
                                    Create a post
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: "Active Jobs", value: stats.activeJobs, icon: Briefcase, color: "text-blue-400" },
                                { title: "Total Applications", value: stats.totalApplications, icon: FileText, color: "text-green-400" },
                                { title: "Shortlisted", value: stats.shortlisted, icon: CheckCircle, color: "text-purple-400" },
                            ].map((stat, i) => (
                                <GlassCard key={i} className="p-6 flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center shrink-0">
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-[var(--text-dim)] text-sm font-medium">{stat.title}</p>
                                        <p className="text-3xl font-bold text-[var(--text-main)]">{stat.value}</p>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "jobs" && (
                    <GlassCard className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[var(--text-main)]">Manage Your Jobs</h3>
                            <Link href="/business/post-job">
                                <Button className="rounded-full bg-[#111827] text-white dark:bg-white dark:text-black hover:bg-[#111827]/90 dark:hover:bg-white/90 font-bold flex items-center gap-2">
                                    <PlusCircle className="w-4 h-4" />
                                    Post New
                                </Button>
                            </Link>
                        </div>
                        
                        {loadingJobs ? (
                            <div className="text-center py-20 border border-dashed border-[var(--glass-border)] rounded-xl">
                                <p className="text-[var(--text-dim)]">Loading your jobs...</p>
                            </div>
                        ) : jobs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {jobs.map((job) => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 border border-dashed border-[var(--glass-border)] rounded-xl">
                                <Briefcase className="w-10 h-10 mx-auto text-[var(--text-dim)] mb-4 opacity-50" />
                                <p className="text-[var(--text-dim)] mb-4">You have no active job postings.</p>
                                <Link href="/business/post-job">
                                    <Button variant="outline" className="rounded-full border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10">
                                        Post your first job
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </GlassCard>
                )}

                {activeTab === "applications" && (
                    <GlassCard className="p-8">
                        <h3 className="text-xl font-bold text-[var(--text-main)] mb-6">Recent Applications</h3>
                        <div className="text-center py-20 border border-dashed border-[var(--glass-border)] rounded-xl">
                            <FileText className="w-10 h-10 mx-auto text-[var(--text-dim)] mb-4 opacity-50" />
                            <p className="text-[var(--text-dim)]">No applications received yet.</p>
                        </div>
                    </GlassCard>
                )}

                {activeTab === "profile" && (
                    <GlassCard className="p-8 relative">
                        <div className="absolute top-8 right-8 flex flex-col items-end">
                            <span className="text-2xl font-bold text-[var(--primary)]">{calculateCompletion()}%</span>
                            <span className="text-xs text-[var(--text-dim)] uppercase tracking-wider">Profile Completed</span>
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-main)] mb-6">Company Profile Settings</h3>
                        <p className="text-[var(--text-dim)] mb-6 max-w-2xl">Update your company description, industry, and website here to appear in job postings.</p>
                        
                        <div className="flex flex-col gap-6 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[var(--text-main)]">Company Name *</label>
                                    <input 
                                        type="text" 
                                        value={profile.companyName}
                                        onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                                        disabled={!isEditingProfile}
                                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-main)] outline-none disabled:opacity-60 disabled:cursor-not-allowed" 
                                        placeholder="Acme Corp" 
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[var(--text-main)]">Industry *</label>
                                    <input 
                                        type="text" 
                                        value={profile.industry}
                                        onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                                        disabled={!isEditingProfile}
                                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-main)] outline-none disabled:opacity-60 disabled:cursor-not-allowed" 
                                        placeholder="Technology, Finance, etc." 
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[var(--text-main)]">Point of Contact *</label>
                                    <input 
                                        type="text" 
                                        value={profile.contactPerson}
                                        onChange={(e) => setProfile({ ...profile, contactPerson: e.target.value })}
                                        disabled={!isEditingProfile}
                                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-main)] outline-none disabled:opacity-60 disabled:cursor-not-allowed" 
                                        placeholder="Aditya Varma" 
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[var(--text-main)]">Work Email *</label>
                                    <input 
                                        type="email" 
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        disabled={!isEditingProfile}
                                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-main)] outline-none disabled:opacity-60 disabled:cursor-not-allowed" 
                                        placeholder="aditya@acmecorp.com" 
                                    />
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[var(--text-main)]">Phone Number *</label>
                                    <input 
                                        type="text" 
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        disabled={!isEditingProfile}
                                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-main)] outline-none disabled:opacity-60 disabled:cursor-not-allowed" 
                                        placeholder="+91 98765 43210" 
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[var(--text-main)]">Company Website (URL)</label>
                                    <input 
                                        type="text" 
                                        value={profile.companyWebsite}
                                        onChange={(e) => setProfile({ ...profile, companyWebsite: e.target.value })}
                                        disabled={!isEditingProfile}
                                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-main)] outline-none disabled:opacity-60 disabled:cursor-not-allowed" 
                                        placeholder="https://acmecorp.com" 
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[var(--text-main)]">Company Size *</label>
                                    <select
                                        value={profile.companySize}
                                        onChange={(e) => setProfile({ ...profile, companySize: e.target.value })}
                                        disabled={!isEditingProfile}
                                        className="flex h-[50px] w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <option value="" className="bg-[var(--glass-bg)] text-[var(--text-main)]">Select Size</option>
                                        <option value="1-10" className="bg-[var(--glass-bg)] text-[var(--text-main)]">1-10 employees</option>
                                        <option value="11-50" className="bg-[var(--glass-bg)] text-[var(--text-main)]">11-50 employees</option>
                                        <option value="51-200" className="bg-[var(--glass-bg)] text-[var(--text-main)]">51-200 employees</option>
                                        <option value="201-500" className="bg-[var(--glass-bg)] text-[var(--text-main)]">201-500 employees</option>
                                        <option value="500+" className="bg-[var(--glass-bg)] text-[var(--text-main)]">500+ employees</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[var(--text-main)]">GST Number (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={profile.gstNumber}
                                        onChange={(e) => setProfile({ ...profile, gstNumber: e.target.value })}
                                        disabled={!isEditingProfile}
                                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-main)] outline-none disabled:opacity-60 disabled:cursor-not-allowed" 
                                        placeholder="Optional GST ID" 
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-[var(--text-main)]">Hire Status *</label>
                                <select
                                    value={profile.hiringNeeds}
                                    onChange={(e) => setProfile({ ...profile, hiringNeeds: e.target.value })}
                                    disabled={!isEditingProfile}
                                    className="flex h-[50px] w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <option value="" className="bg-[var(--glass-bg)] text-[var(--text-main)]">Select Status</option>
                                    <option value="Actively Hiring" className="bg-[var(--glass-bg)] text-[var(--text-main)]">Actively Hiring</option>
                                    <option value="Occasionally Hiring" className="bg-[var(--glass-bg)] text-[var(--text-main)]">Occasionally Hiring</option>
                                    <option value="Not Hiring" className="bg-[var(--glass-bg)] text-[var(--text-main)]">Not Hiring</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-[var(--text-main)]">Company Description</label>
                                <textarea 
                                    value={profile.description}
                                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                                    disabled={!isEditingProfile}
                                    className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-main)] outline-none min-h-[120px] disabled:opacity-60 disabled:cursor-not-allowed" 
                                    placeholder="Tell us about your company..."
                                ></textarea>
                            </div>
                            
                            {isEditingProfile ? (
                                <div className="flex gap-4 mt-4">
                                    <Button 
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className="rounded-full px-8 py-6 text-lg bg-[#111827] dark:bg-white text-white dark:text-black"
                                    >
                                        {isSaving ? "Saving..." : "Save Profile"}
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        onClick={() => setIsEditingProfile(false)}
                                        disabled={isSaving}
                                        className="rounded-full px-8 py-6 text-lg border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-main)] hover:bg-[var(--glass-border)]"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <Button 
                                    onClick={() => setIsEditingProfile(true)}
                                    className="w-max mt-4 rounded-full px-8 py-6 text-lg bg-[#111827] dark:bg-white text-white dark:text-black"
                                >
                                    Update Profile
                                </Button>
                            )}
                        </div>
                    </GlassCard>
                )}
            </div>
        </div>
    );
}
