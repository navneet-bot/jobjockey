"use client";

import { motion } from "framer-motion";
import { Job } from "@/lib/schema";
import { GlassCard } from "./GlassCard";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Briefcase, GraduationCap, Building2, Clock } from "lucide-react";
import Link from "next/link";
import { GradientButton } from "./GradientButton";
import SectionReveal from "./SectionReveal";

export function JobCard({ job }: { job: Job }) {
    const isInternship = job.jobCategory === "internship";
    const isTraining = job.jobCategory === "training";

    const badgeColor = "text-[#111827] dark:text-[var(--primary)] bg-black/5 dark:bg-[rgba(255,255,255,0.12)] border-black/10 dark:border-[rgba(255,255,255,0.08)]";

    return (
        <SectionReveal>
            <GlassCard className="flex flex-col gap-4 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                {/* Gradient Bottom Border Effect */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--glass-border)]">
                            <motion.div whileHover={{ rotate: 8, scale: 1.1 }}>
                                <Building2 className="text-[#111827]/60 dark:text-muted-foreground w-6 h-6" />
                            </motion.div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-[#111827] dark:text-foreground line-clamp-1">{job.title}</h3>
                            <p className="text-[#111827]/60 dark:text-muted-foreground text-sm">{job.company}</p>
                        </div>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${badgeColor}`}>
                        {job.jobCategory.charAt(0).toUpperCase() + job.jobCategory.slice(1)}
                    </span>
                </div>

                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-[#111827]/70 dark:text-muted-foreground mt-2">
                    <div className="flex items-center gap-1.5 group/icon">
                        <MapPin className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                        {job.location}
                    </div>
                    <div className="flex items-center gap-1.5 group/icon">
                        <Briefcase className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                        {job.jobType}
                    </div>
                    <div className="flex items-center gap-1.5 group/icon">
                        <GraduationCap className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                        {job.experienceLevel}
                    </div>
                </div>

                {job.salary && (
                    <div className="text-sm font-medium text-[#111827] dark:text-foreground mt-1">
                        {isInternship ? `Stipend: ${job.salary}` : job.salary}
                    </div>
                )}

                {isInternship && job.duration && (
                    <div className="flex items-center gap-1.5 text-xs text-[#111827]/60 dark:text-muted-foreground mt-1">
                        <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                        Duration: {job.duration}
                    </div>
                )}

                <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-[#111827]/50 dark:text-muted-foreground">
                        {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                    </span>
                    <Link href={`/jobs/${job.id}`}>
                        <GradientButton className="py-2 px-4 text-sm h-auto">
                            View Details
                        </GradientButton>
                    </Link>
                </div>
            </GlassCard>
        </SectionReveal>
    );
}
