"use client";

import { useState } from "react";
import { CompanyOverviewTab } from "./CompanyOverviewTab";
import { CompanyJobsTab } from "./CompanyJobsTab";
import { CompanyApplicationsTab } from "./CompanyApplicationsTab";
import { Building2, Briefcase, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function CompanyDetailsView({ company }: { company: any }) {
    const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "applications">("overview");

    const tabs = [
        { id: "overview", label: "Company Overview", icon: Building2 },
        { id: "jobs", label: "Jobs Posted", icon: Briefcase },
        { id: "applications", label: "Applications / Shortlisting", icon: Users },
    ] as const;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-2xl w-fit border border-black/5 dark:border-white/5">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
                            activeTab === tab.id
                                ? "bg-[var(--primary)] text-black shadow-lg"
                                : "text-muted-foreground hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="mt-2">
                {activeTab === "overview" && <CompanyOverviewTab company={company} />}
                {activeTab === "jobs" && <CompanyJobsTab companyId={company.id} />}
                {activeTab === "applications" && <CompanyApplicationsTab companyId={company.id} />}
            </div>
        </div>
    );
}
