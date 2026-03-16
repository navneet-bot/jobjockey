"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { CompanyEnquiry } from "@/lib/schema";
import { Building2, Globe, Mail, Phone, Users, FileText, Briefcase, Factory, ClipboardList, MessageSquare, Calendar } from "lucide-react";
import { format } from "date-fns";

export function CompanyOverviewTab({ company }: { company: CompanyEnquiry }) {
    return (
        <GlassCard className="p-8 flex flex-col gap-8 border-black/5 dark:border-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Company Name</label>
                    <div className="flex items-center gap-3 text-[var(--text-main)]">
                        <Building2 className="w-5 h-5 text-[var(--text-main)]" />
                        <span className="font-semibold">{company.companyName}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Website</label>
                    {company.companyUrl ? (
                        <a href={company.companyUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[var(--text-main)] hover:text-[var(--text-main)] transition-colors hover:underline">
                            <Globe className="w-5 h-5" />
                            <span>{company.companyUrl}</span>
                        </a>
                    ) : (
                        <span className="text-muted-foreground italic">Not provided</span>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Industry</label>
                    <div className="flex items-center gap-3 text-[var(--text-main)]">
                        <Factory className="w-5 h-5 text-[var(--text-main)]" />
                        <span className="font-semibold">{company.industry || "Not provided"}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                    <div className="flex items-center gap-3 text-[var(--text-main)]">
                        <Mail className="w-5 h-5 text-[var(--text-main)]" />
                        <span>{company.email}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                    <div className="flex items-center gap-3 text-[var(--text-main)]">
                        <Phone className="w-5 h-5 text-[var(--text-main)]" />
                        <span>{company.phone}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Company Size</label>
                    <div className="flex items-center gap-3 text-[var(--text-main)]">
                        <Users className="w-5 h-5 text-[var(--text-main)]" />
                        <span>{company.companySize} Employees</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact Person</label>
                    <div className="flex items-center gap-3 text-[var(--text-main)]">
                        <Users className="w-5 h-5 text-[var(--text-main)]" />
                        <span className="font-semibold">{company.contactPerson}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Designation</label>
                    <div className="flex items-center gap-3 text-[var(--text-main)]">
                        <Briefcase className="w-5 h-5 text-[var(--text-main)]" />
                        <span>{company.designation || "N/A"}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">GST Number</label>
                    <div className="flex items-center gap-3 text-[var(--text-main)]">
                        <FileText className="w-5 h-5 text-[var(--text-main)]" />
                        <span>{company.gstNumber || "N/A"}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <ClipboardList className="w-4 h-4" />
                            Hiring Needs
                        </label>
                        <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[var(--text-main)] whitespace-pre-wrap min-h-[50px] flex items-center">
                            {company.hiringNeeds || <span className="text-muted-foreground italic">No hiring needs specified</span>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Submitted On
                        </label>
                        <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[var(--text-main)] flex items-center">
                            <span>{format(new Date(company.submittedAt), "PPP p")}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Additional Message
                    </label>
                    <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[var(--text-main)] whitespace-pre-wrap min-h-[50px]">
                        {company.message || <span className="text-muted-foreground italic">No additional message provided</span>}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
