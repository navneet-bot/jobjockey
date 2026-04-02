"use client";

import { useEffect, useState, useCallback } from "react";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { ApplicantFilters } from "@/components/admin/applicants/ApplicantFilters";
import { ApplicantTable } from "@/components/admin/applicants/ApplicantTable";
import { ExportCSVButton } from "@/components/admin/applicants/ExportCSVButton";
import { getAllTalents } from "@/actions/admin/talentActions";
import { Loader2 } from "lucide-react";

export default function AdminApplicantsGroupPage() {
    const [talents, setTalents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        search: "",
        experienceLevel: "all",
        skillsKeyword: "",
        minCompletion: 0,
        page: 1,
        pageSize: 10
    });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllTalents({
                search: filters.search,
                experienceLevel: filters.experienceLevel,
                skillsKeyword: filters.skillsKeyword,
                minCompletion: filters.minCompletion,
                page: filters.page,
                pageSize: filters.pageSize
            });
            setTalents(res.data);
            setTotal(res.total);
        } catch (err) {
            console.error("Data load error:", err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <div className="flex flex-col gap-8 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6 sm:gap-4 flex-wrap">
                <GradientHeader
                    align="left"
                    title="Talent Directory"
                    subtitle="Explore all registered candidates and manage talent profiles across JobJockey."
                    className="max-w-3xl"
                />
                <div className="pt-0 sm:pt-4">
                    <ExportCSVButton data={talents} />
                </div>
            </div>

            <ApplicantFilters filters={filters} onFilterChange={setFilters} />

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-6">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-[var(--primary)]/10 blur-2xl animate-pulse" />
                        <Loader2 className="w-16 h-16 text-[var(--primary)] animate-spin relative z-10" />
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-[var(--text-main)] mb-1">Accessing Database</p>
                        <p className="text-muted-foreground animate-pulse font-medium">Fetching global talent profiles...</p>
                    </div>
                </div>
            ) : (
                <ApplicantTable 
                    applicants={talents} 
                    onStatusUpdate={loadData} 
                />
            )}
        </div>
    );
}
