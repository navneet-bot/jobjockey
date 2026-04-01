"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { ChevronRight, Building2, Briefcase } from "lucide-react";

export function CompanyList({ companies, onSelect }: { companies: any[], onSelect: (id: string, name: string) => void }) {
    if (companies.length === 0) {
        return (
            <GlassCard className="p-10 text-center">
                <p className="text-muted-foreground">No companies found with active jobs or applicants.</p>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[var(--glass-bg)] border-b border-[var(--glass-border)] text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4 font-medium">Company Name</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium">Total Jobs Posted</th>
                            <th className="px-6 py-4 font-medium">Total Applicants</th>
                            <th className="px-6 py-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--glass-border)] text-[var(--text-main)]">
                        {companies.map((company) => (
                            <tr key={company.id} className="hover:bg-[var(--glass-bg)] transition-colors group cursor-pointer" onClick={() => onSelect(company.id, company.name)}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-[var(--glass-border)] flex items-center justify-center border border-black/10 dark:border-white/5 shadow-inner">
                                            <Building2 className="w-4 h-4 text-muted-foreground dark:text-white" />
                                        </div>
                                        <span className="font-semibold text-base">{company.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{company.email}</td>
                                <td className="px-6 py-4 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Briefcase className="w-4 h-4 text-blue-500" />
                                        {company.totalJobs}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium">{company.totalApplicants}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        className="inline-flex items-center gap-1 text-black dark:text-[var(--primary)] text-xs font-semibold hover:underline"
                                    >
                                        View Jobs <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
}
