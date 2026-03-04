"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { CompanyEnquiry } from "@/lib/schema";
import { Building2, Globe, Mail, Phone, Users, FileText } from "lucide-react";

export function CompanyOverviewTab({ company }: { company: CompanyEnquiry }) {
    return (
        <GlassCard className="p-8 flex flex-col gap-6 border-black/5 dark:border-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">GST Number</label>
                    <div className="flex items-center gap-3 text-[var(--text-main)]">
                        <FileText className="w-5 h-5 text-[var(--text-main)]" />
                        <span>{company.gstNumber || "N/A"}</span>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
