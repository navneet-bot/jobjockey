import { getTalentFullDetail } from "@/actions/admin/talentActions";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { 
    Mail, 
    Phone, 
    Linkedin, 
    Github, 
    Globe, 
    BookOpen, 
    Briefcase, 
    Download, 
    FileText,
    CheckCircle2,
    Calendar,
    ArrowLeft,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ApplicationPulse } from "./ApplicationPulse";

export default async function TalentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getTalentFullDetail(id);

    if (!data) {
        notFound();
    }

    const { profile, applications } = data;

    const getCompletionColor = (percent: number) => {
        if (percent >= 90) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
        if (percent >= 70) return "text-blue-500 bg-blue-500/10 border-blue-500/20";
        if (percent >= 50) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    };

    return (
        <div className="pb-20">
            {/* Top Navigation */}
            <div className="max-w-7xl mx-auto px-6 pt-8">
                <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/60 mb-6">
                    <Link href="/admin/applicants" className="hover:text-[var(--primary)] transition-colors">Talent Directory</Link>
                    <ChevronRight className="w-3 h-3 opacity-30" />
                    <span className="text-muted-foreground">{profile.name}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-6">
                        <Link 
                            href="/admin/applicants" 
                            className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center hover:bg-white/80 dark:hover:bg-white/10 transition-all group shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-[#111827] dark:text-white tracking-tight leading-none mb-3">{profile.name}</h1>
                            <div className="flex items-center gap-3 flex-wrap">
                                <Badge className="bg-black text-white dark:bg-[var(--primary)] dark:text-black font-black text-[9px] py-0 h-5 px-3">TALENT PROFILE</Badge>
                                <div className={`flex items-center gap-2 px-3 h-5 rounded-full border ${getCompletionColor(profile.completionPercent)} bg-opacity-5 font-black text-[9px] tracking-tight`}>
                                    <CheckCircle2 className="w-3 h-3" />
                                    {profile.completionPercent}% MATURITY
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Joined {format(new Date(profile.createdAt), "MMM yyyy")}
                                </div>
                            </div>
                        </div>
                    </div>

                    {profile.resumeUrl && (
                        <div className="flex items-center h-11 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 overflow-hidden shadow-sm">
                            <a 
                                href={profile.resumeUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="h-full px-6 flex items-center gap-3 hover:bg-blue-500/10 transition-all group text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest"
                                title="View Resume"
                            >
                                <FileText className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                                View Resume
                            </a>
                            <div className="w-[1px] h-4 bg-black/5 dark:bg-white/10" />
                            <a 
                                href={profile.resumeUrl} 
                                download 
                                className="h-full px-5 flex items-center justify-center hover:bg-emerald-500/10 transition-all group text-emerald-600 dark:text-emerald-400"
                                title="Download Resume"
                            >
                                <Download className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                            </a>
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Information */}
                        <GlassCard className="p-8 border-white/5 relative overflow-hidden bg-white/70 dark:bg-white/[0.03] shadow-sm">
                            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-8 opacity-60">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:border-[var(--primary)]/30 transition-colors shadow-inner">
                                        <Mail className="w-4 h-4 text-black dark:text-[var(--primary)]" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Email Address</span>
                                        <span className="text-[13px] font-bold text-[#111827] dark:text-white/90 truncate">{profile.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:border-[var(--primary)]/30 transition-colors shadow-inner">
                                        <Phone className="w-4 h-4 text-black dark:text-[var(--primary)]" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Phone Number</span>
                                        <span className="text-[13px] font-bold text-[#111827] dark:text-white/90">{profile.phone || "Not provided"}</span>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Career Stats */}
                        <GlassCard className="p-8 border-white/5 relative overflow-hidden bg-white/70 dark:bg-white/[0.03] shadow-sm">
                            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-8 opacity-60">Career Stats</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                                        <BookOpen className="w-4 h-4 text-black dark:text-[var(--primary)]" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Education</span>
                                        <span className="text-[13px] font-bold text-[#111827] dark:text-white/90 leading-snug break-words line-clamp-2">{profile.education || "Not specified"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                                        <Briefcase className="w-4 h-4 text-black dark:text-[var(--primary)]" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Job Preference</span>
                                        <span className="text-[13px] font-bold text-[#111827] dark:text-white/90">{profile.experience || "Not specified"}</span>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Digital Presence */}
                        <GlassCard className="p-8 border-white/5 relative overflow-hidden bg-white/70 dark:bg-white/[0.03] shadow-sm">
                            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-8 opacity-60">Digital Presence</h3>
                            {profile.linkedin || profile.github || profile.portfolioUrl ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-6">
                                    {profile.linkedin && (
                                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center hover:bg-[#0077b5]/10 hover:border-[#0077b5]/30 transition-all group">
                                            <Linkedin className="w-4 h-4 text-[#0077b5] opacity-60 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    )}
                                    {profile.github && (
                                        <a href={profile.github} target="_blank" rel="noopener noreferrer" className="h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center hover:bg-black/10 hover:border-black/20 dark:hover:bg-white/10 dark:hover:border-white/20 transition-all group">
                                            <Github className="w-4 h-4 text-[#111827] dark:text-white opacity-60 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    )}
                                    {profile.portfolioUrl && (
                                        <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center hover:bg-blue-500/10 hover:border-blue-500/30 transition-all group">
                                            <Globe className="w-4 h-4 text-blue-500 dark:text-blue-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <div className="flex-grow flex items-center justify-center py-6">
                                    <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">No links provided</p>
                                </div>
                            )}
                        </GlassCard>
                    </div>

                    {/* Technical Expertise Row (Stretched) */}
                    <GlassCard className="p-8 border-white/5 bg-white/70 dark:bg-white/[0.03] shadow-sm">
                        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-6 opacity-60">Technical Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.topSkills?.map((skill: string, index: number) => (
                                <span key={index} className="px-5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs font-bold text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-default">
                                    {skill}
                                </span>
                            ))}
                            {(!profile.topSkills || profile.topSkills.length === 0) && (
                                <p className="text-muted-foreground text-sm font-medium">No skills listed.</p>
                            )}
                        </div>
                    </GlassCard>

                    {/* Application History Row (Stretched) */}

                    {/* Application History Row (Stretched) */}
                    <GlassCard className="border-white/5 bg-white/70 dark:bg-white/[0.03] overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-black/5 dark:border-white/5">
                            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-60">Application Pulse</h3>
                        </div>
                        <ApplicationPulse 
                            applications={applications} 
                        />
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
