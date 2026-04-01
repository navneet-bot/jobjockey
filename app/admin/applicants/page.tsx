"use client";

import { useEffect, useState, useMemo } from "react";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { ApplicantFilters } from "@/components/admin/applicants/ApplicantFilters";
import { ApplicantTable } from "@/components/admin/applicants/ApplicantTable";
import { ExportCSVButton } from "@/components/admin/applicants/ExportCSVButton";
import { getGlobalApplicantsForAdmin } from "@/actions/applicationActions";
import { Loader2 } from "lucide-react";

export default function AdminApplicantsGroupPage() {
    const [applicants, setApplicants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        jobTitle: "",
        status: "all",
        fromDate: "",
        toDate: ""
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getGlobalApplicantsForAdmin();
            setApplicants(data);
        } catch (err) {
            console.error("Data load error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredApplicants = useMemo(() => {
        return applicants.filter(app => {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch = !filters.search || 
                                 app.candidateName.toLowerCase().includes(searchLower) || 
                                 app.email.toLowerCase().includes(searchLower);
            
            const matchesJob = !filters.jobTitle || 
                              app.jobTitle.toLowerCase().includes(filters.jobTitle.toLowerCase());
            
            const matchesStatus = filters.status === "all" || app.status === filters.status;
            
            let matchesDate = true;
            if (filters.fromDate) {
                const appDate = new Date(app.appliedAt);
                const fromDate = new Date(filters.fromDate);
                fromDate.setHours(0, 0, 0, 0);
                matchesDate = matchesDate && appDate >= fromDate;
            }
            if (filters.toDate) {
                const appDate = new Date(app.appliedAt);
                const toDate = new Date(filters.toDate);
                toDate.setHours(23, 59, 59, 999);
                matchesDate = matchesDate && appDate <= toDate;
            }

            return matchesSearch && matchesJob && matchesStatus && matchesDate;
        });
    }, [applicants, filters]);

    return (
        <div className="flex flex-col gap-8 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6 sm:gap-4 flex-wrap">
                <GradientHeader
                    align="left"
                    title="Candidate Applications"
                    subtitle="Manage job applications across the entire platform and update applicant progression."
                    className="max-w-3xl"
                />
                <div className="pt-0 sm:pt-4">
                    <ExportCSVButton data={filteredApplicants} />
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
                        <p className="text-xl font-bold text-[var(--text-main)] mb-1">Fetching Data</p>
                        <p className="text-muted-foreground animate-pulse font-medium">Accessing global applicant matching system...</p>
                    </div>
                </div>
            ) : (
                <ApplicantTable 
                    applicants={filteredApplicants} 
                    onStatusUpdate={loadData} 
                />
            )}
        </div>
    );
}
