"use client";

import { useEffect, useState } from "react";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { CompanyList } from "@/components/admin/applications/CompanyList";
import { JobList } from "@/components/admin/applications/JobList";
import { ApplicantList } from "@/components/admin/applications/ApplicantList";
import { getCompaniesWithStats, getCompanyJobsStats, getJobApplicants } from "@/actions/aiActions";
import { Loader2 } from "lucide-react";

export default function AdminApplicationsPage() {
    const [level, setLevel] = useState<1 | 2 | 3>(1);
    const [loading, setLoading] = useState(true);

    // Level 1: Companies
    const [companies, setCompanies] = useState<any[]>([]);
    
    // Level 2: Jobs
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
    const [selectedCompanyName, setSelectedCompanyName] = useState<string>("");
    const [jobs, setJobs] = useState<any[]>([]);

    // Level 3: Applicants
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [selectedJobTitle, setSelectedJobTitle] = useState<string>("");
    const [isInternship, setIsInternship] = useState<boolean>(false);
    const [applicants, setApplicants] = useState<any[]>([]);

    const loadCompanies = async () => {
        setLoading(true);
        try {
            const data = await getCompaniesWithStats();
            setCompanies(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const loadJobs = async (companyId: string) => {
        setLoading(true);
        try {
            const data = await getCompanyJobsStats(companyId);
            setJobs(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const loadApplicants = async (jobId: string, internshipFlag: boolean = false) => {
        setLoading(true);
        try {
            const data = await getJobApplicants(jobId, internshipFlag);
            setApplicants(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (level === 1) {
            loadCompanies();
        } else if (level === 2 && selectedCompanyId) {
            loadJobs(selectedCompanyId);
        } else if (level === 3 && selectedJobId) {
            loadApplicants(selectedJobId, isInternship);
        }
    }, [level, selectedCompanyId, selectedJobId, isInternship]);

    const handleSelectCompany = (id: string, name: string) => {
        setSelectedCompanyId(id);
        setSelectedCompanyName(name);
        setLevel(2);
    };

    const handleSelectJob = (id: string, title: string, category: string) => {
        setSelectedJobId(id);
        setSelectedJobTitle(title);
        setIsInternship(category === "Internship");
        setLevel(3);
    };

    const handleBackToCompanies = () => {
        setSelectedCompanyId(null);
        setLevel(1);
    };

    const handleBackToJobs = () => {
        setSelectedJobId(null);
        setLevel(2);
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
                </div>
            );
        }

        if (level === 1) {
            return <CompanyList companies={companies} onSelect={handleSelectCompany} />;
        }
        if (level === 2 && selectedCompanyId) {
            return (
                <JobList 
                    jobs={jobs} 
                    companyName={selectedCompanyName} 
                    onSelect={handleSelectJob} 
                    onBack={handleBackToCompanies} 
                />
            );
        }
        if (level === 3 && selectedJobId) {
            return (
                <ApplicantList 
                    applicants={applicants} 
                    jobTitle={selectedJobTitle} 
                    jobId={selectedJobId} 
                    isInternship={isInternship}
                    onBack={handleBackToJobs} 
                    onRefresh={() => loadApplicants(selectedJobId, isInternship)} 
                />
            );
        }
    };

    return (
        <div className="flex flex-col gap-10">
            <GradientHeader
                align="left"
                title="Candidate Applications"
                subtitle={
                    level === 1 ? "Select a company to view their posted jobs and manage applicants." :
                    level === 2 ? `Viewing jobs posted by ${selectedCompanyName}. Select a job to run AI analysis.` :
                    `Analyzing and ranking candidates for ${selectedJobTitle}.`
                }
            />
            {renderContent()}
        </div>
    );
}
