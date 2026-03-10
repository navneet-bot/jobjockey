"use client";

import { GradientHeader } from "@/components/ui/GradientHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
    Briefcase, 
    FileText, 
    CheckCircle, 
    BarChart, 
    Settings, 
    PlusCircle,
    GraduationCap, 
    User, 
    Mail, 
    Phone, 
    Calendar, 
    ArrowRight, 
    Check, 
    X, 
    Clock, 
    Building2, 
    Globe, 
    Users, 
    ShieldCheck, 
    Tag, 
    UserCheck 
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getBusinessDashboardStats } from "@/actions/dashboardActions";
import { getCompanyProfile, updateCompanyProfile, CompanyProfileData } from "@/actions/userActions";
import { getMyJobs } from "@/actions/jobActions";
import { getMyInternships } from "@/actions/internshipActions";
import { getCompanyApplications, updateApplicationStatus } from "@/actions/applicationActions";
import { useForm, Controller } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Job, Internship } from "@/lib/schema";
import { toast } from "sonner";
import JobCard from "@/components/features/job/JobCard";

export default function BusinessDashboardPage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState({ activeJobs: 0, totalApplications: 0, shortlisted: 0 });
    const [jobs, setJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingApps, setLoadingApps] = useState(true);
    const [profile, setProfile] = useState<CompanyProfileData>({ 
        companyName: "", 
        industry: "", 
        companyWebsite: "", 
        description: "",
        contactPerson: "",
        designation: "",
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
            profile.designation,
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
            const [statsData, profileData, jobData, internshipData, appsData] = await Promise.all([
                getBusinessDashboardStats(),
                getCompanyProfile(),
                getMyJobs(),
                getMyInternships(),
                getCompanyApplications()
            ]);

            if (mounted) {
                setStats(statsData);
                
                const combined = [
                    ...jobData.map((j: Job) => ({ ...j, jobCategory: 'job' as const })),
                    ...internshipData.map((i: Internship) => ({ ...i, jobCategory: 'internship' as const }))
                ];
                setJobs(combined);
                setLoadingJobs(false);

                setApplications(appsData);
                setLoadingApps(false);

                if (profileData) {
                    setProfile({
                        companyName: profileData.companyName || "",
                        industry: profileData.industry || "",
                        companyWebsite: profileData.companyWebsite || "",
                        description: profileData.description || "",
                        contactPerson: profileData.contactPerson || "",
                        designation: profileData.designation || "",
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

    const handleUpdateStatus = async (appId: string, status: "shortlisted" | "pending" | "interview" | "selected" | "rejected") => {
        const res = await updateApplicationStatus(appId, status);
        if (res.success) {
            toast.success(`Status updated to ${status}`);
            const updatedApps = await getCompanyApplications();
            setApplications(updatedApps);
        } else {
            toast.error(res.error || "Failed to update status");
        }
    };

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

                        {/* Detailed Company Overview Summary */}
                        <GlassCard className="p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <Building2 className="w-6 h-6 text-blue-400" />
                                <h3 className="text-xl font-bold text-[var(--text-main)]">Company Overview</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-[0.15em] opacity-60">Company Name</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                            <Building2 className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="font-semibold text-[var(--text-main)]">{profile.companyName || "Not provided"}</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-[0.15em] opacity-60">Industry</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                            <Tag className="w-4 h-4 text-purple-400" />
                                        </div>
                                        <span className="font-semibold text-[var(--text-main)]">{profile.industry || "Not provided"}</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-[0.15em] opacity-60">Website</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                            <Globe className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="font-semibold text-[var(--text-main)] italic opacity-80">{profile.companyWebsite || "Not provided"}</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-[0.15em] opacity-60">Email Address</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                            <Mail className="w-4 h-4 text-green-400" />
                                        </div>
                                        <span className="font-semibold text-[var(--text-main)]">{profile.email || "Not provided"}</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-[0.15em] opacity-60">Phone Number</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                            <Phone className="w-4 h-4 text-green-400" />
                                        </div>
                                        <span className="font-semibold text-[var(--text-main)]">{profile.phone || "Not provided"}</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-[0.15em] opacity-60">Company Size</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                            <Users className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="font-semibold text-[var(--text-main)]">{profile.companySize ? `${profile.companySize} Employees` : "Not provided"}</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-[0.15em] opacity-60">Contact Person</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                            <User className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="font-semibold text-[var(--text-main)]">{profile.contactPerson || "Not provided"}</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-[0.15em] opacity-60">Designation</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                            <Briefcase className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="font-semibold text-[var(--text-main)]">{profile.designation || "Not provided"}</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-[0.15em] opacity-60">Hire Status</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                            <UserCheck className="w-4 h-4 text-purple-400" />
                                        </div>
                                        <span className={`font-semibold ${profile.hiringNeeds === 'Not Hiring' ? 'text-red-400' : 'text-green-400'}`}>
                                            {profile.hiringNeeds || "Not specified"}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-[0.15em] opacity-60">GST Number</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                            <ShieldCheck className="w-4 h-4 text-green-400" />
                                        </div>
                                        <span className="font-semibold text-[var(--text-main)]">{profile.gstNumber || "N/A"}</span>
                                    </div>
                                </div>
                            </div>

                            {profile.description && (
                                <div className="mt-12 pt-8 border-t border-[var(--glass-border)]">
                                    <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-[0.15em] opacity-60 mb-4">Company Overview / Message</p>
                                    <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                        <p className="text-[var(--text-dim)] leading-relaxed text-sm">{profile.description}</p>
                                    </div>
                                </div>
                            )}
                        </GlassCard>
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
                                <Link href="/business/post-job">
                                    <Button variant="outline" className="rounded-full border-[#111827] text-[#111827] dark:border-white dark:text-white hover:bg-[#111827]/10 dark:hover:bg-white/10">
                                        Post your first job
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </GlassCard>
                )}

                {activeTab === "applications" && (
                    <GlassCard className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[var(--text-main)]">Applications ({applications.length})</h3>
                        </div>
                        
                        {loadingApps ? (
                            <div className="text-center py-20 border border-dashed border-[var(--glass-border)] rounded-xl">
                                <p className="text-[var(--text-dim)]">Loading applications...</p>
                            </div>
                        ) : applications.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {applications.map((app) => {
                                    const isInternship = !!app.internship;
                                    const jobOrInternship = app.job || app.internship;
                                    
                                    return (
                                        <div key={app.application.id} className="p-5 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex flex-col md:flex-row gap-6 hover:border-[var(--primary)]/30 transition-all">
                                            <div className="flex-1 flex flex-col gap-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center border border-[var(--primary)]/20">
                                                            <User className="w-5 h-5 text-[var(--primary)]" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-[var(--text-main)]">{app.profile.name}</h4>
                                                            <p className="text-xs text-[var(--text-dim)] flex items-center gap-3">
                                                                <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {app.profile.email}</span>
                                                                <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> {app.profile.phone}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                        app.application.status === 'selected' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                        app.application.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                        app.application.status === 'interview' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                        app.application.status === 'shortlisted' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                        'bg-black/5 dark:bg-white/5 text-[var(--text-dim)] border-black/10 dark:border-white/10'
                                                    }`}>
                                                        {app.application.status}
                                                    </div>
                                                </div>
                                                
                                                <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col gap-1">
                                                    <p className="text-xs text-[var(--text-dim)] uppercase tracking-widest font-bold">Applying for</p>
                                                    <div className="flex items-center gap-2">
                                                        {isInternship ? <GraduationCap className="w-4 h-4 text-[var(--primary)]"/> : <Briefcase className="w-4 h-4 text-[var(--primary)]"/>}
                                                        <span className="font-semibold text-sm text-[var(--text-main)]">{jobOrInternship?.title || "Deleted Position"}</span>
                                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-dim)] uppercase">
                                                            {isInternship ? "Internship" : "Job"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex md:flex-col justify-end gap-2 md:w-48">
                                                {app.application.status !== 'selected' && app.application.status !== 'rejected' && (
                                                    <>
                                                        <Button 
                                                            onClick={() => handleUpdateStatus(app.application.id, 'shortlisted')}
                                                            variant="outline" size="sm" className="rounded-full w-full justify-start gap-2 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                                                        >
                                                            <Clock className="w-3 h-3"/> Shortlist
                                                        </Button>
                                                        <Button 
                                                            onClick={() => handleUpdateStatus(app.application.id, 'interview')}
                                                            variant="outline" size="sm" className="rounded-full w-full justify-start gap-2 border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
                                                        >
                                                            <ArrowRight className="w-3 h-3"/> Interview
                                                        </Button>
                                                        <div className="flex gap-2">
                                                            <Button 
                                                                onClick={() => handleUpdateStatus(app.application.id, 'selected')}
                                                                className="rounded-full flex-1 bg-green-500 hover:bg-green-600 text-white" size="sm"
                                                            >
                                                                <Check className="w-4 h-4"/>
                                                            </Button>
                                                            <Button 
                                                                onClick={() => handleUpdateStatus(app.application.id, 'rejected')}
                                                                variant="outline" className="rounded-full flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10" size="sm"
                                                            >
                                                                <X className="w-4 h-4"/>
                                                            </Button>
                                                        </div>
                                                    </>
                                                )}
                                                {app.application.status === 'selected' && (
                                                    <div className="text-center p-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold">
                                                        CANDIDATE SELECTED
                                                    </div>
                                                )}
                                                {app.application.status === 'rejected' && (
                                                    <div className="text-center p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
                                                        APPLICATION REJECTED
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 border border-dashed border-[var(--glass-border)] rounded-xl">
                                <FileText className="w-10 h-10 mx-auto text-[var(--text-dim)] mb-4 opacity-50" />
                                <p className="text-[var(--text-dim)]">No applications received yet.</p>
                            </div>
                        )}
                    </GlassCard>
                )}

                {activeTab === "profile" && (
                    <GlassCard className="p-8 relative">
                        <div className="absolute top-8 right-8 flex flex-col items-end gap-1">
                            <span className="text-2xl font-bold text-[#111827] dark:text-[var(--primary)]">{calculateCompletion()}%</span>
                            <span className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest font-semibold mb-1">Profile Completed</span>
                            <div className="w-32 h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-[#111827] to-[#111827]/80 dark:from-[var(--primary)] dark:to-[var(--primary)]/80 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(0,0,0,0.1)] dark:shadow-[0_0_12px_rgba(var(--primary-rgb),0.3)]"
                                    style={{ width: `${calculateCompletion()}%` }}
                                ></div>
                            </div>
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
                                    <label className="text-sm font-medium text-[var(--text-main)]">Contact Person *</label>
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
                                    <label className="text-sm font-medium text-[var(--text-main)]">Contact Person Designation *</label>
                                    <input 
                                        type="text" 
                                        value={profile.designation}
                                        onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                                        disabled={!isEditingProfile}
                                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-main)] outline-none disabled:opacity-60 disabled:cursor-not-allowed" 
                                        placeholder="HR Manager / Director" 
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
                                    <Select 
                                        value={profile.companySize} 
                                        onValueChange={(val) => setProfile({ ...profile, companySize: val })}
                                        disabled={!isEditingProfile}
                                    >
                                        <SelectTrigger className="h-[50px]">
                                            <SelectValue placeholder="Select Size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1-10">1-10 employees</SelectItem>
                                            <SelectItem value="11-50">11-50 employees</SelectItem>
                                            <SelectItem value="51-200">51-200 employees</SelectItem>
                                            <SelectItem value="201-500">201-500 employees</SelectItem>
                                            <SelectItem value="500+">500+ employees</SelectItem>
                                        </SelectContent>
                                    </Select>
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

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[var(--text-main)]">Hire Status *</label>
                                    <Select 
                                        value={profile.hiringNeeds} 
                                        onValueChange={(val) => setProfile({ ...profile, hiringNeeds: val })}
                                        disabled={!isEditingProfile}
                                    >
                                        <SelectTrigger className="h-[50px]">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Actively Hiring">Actively Hiring</SelectItem>
                                            <SelectItem value="Occasionally Hiring">Occasionally Hiring</SelectItem>
                                            <SelectItem value="Not Hiring">Not Hiring</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-[var(--text-main)]">Company Overview / Message</label>
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
                                        className="rounded-full px-8 py-6 text-lg bg-[#111827] dark:bg-white text-white dark:text-black hover:bg-[#111827]/90 dark:hover:bg-white/90"
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
                                    className="w-max mt-4 rounded-full px-8 py-6 text-lg bg-[#111827] dark:bg-white text-white dark:text-black hover:bg-[#111827]/90 dark:hover:bg-white/90"
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
