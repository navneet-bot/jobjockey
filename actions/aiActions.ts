"use server";
import { db } from "@/lib/db";
import { applicationsTable, jobsTable, internshipsTable, companyEnquiriesTable, userProfilesTable } from "@/lib/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getCompaniesWithStats() {
    const user = await currentUser();
    if (!user || user.publicMetadata?.role !== "admin") return [];

    // Approach: Fetch all jobs and internships, group by company in memory to avoid complex ORM joins limit
    const jobs = await db.select({ id: jobsTable.id, companyId: jobsTable.companyId }).from(jobsTable);
    const internships = await db.select({ id: internshipsTable.id, companyId: internshipsTable.companyId }).from(internshipsTable);
    const applications = await db.select({ jobId: applicationsTable.jobId, internshipId: applicationsTable.internshipId }).from(applicationsTable);
    const companies = await db.select({ id: companyEnquiriesTable.id, name: companyEnquiriesTable.companyName, email: companyEnquiriesTable.email }).from(companyEnquiriesTable);

    const statsMap: Record<string, { id: string, name: string, email: string, totalJobs: number, totalApplicants: number }> = {};
    
    // Initialize map
    companies.forEach(company => {
        statsMap[company.id] = { id: company.id, name: company.name || "Unknown", email: company.email, totalJobs: 0, totalApplicants: 0 };
    });

    const jobToCompanyMap: Record<string, string> = {};
    
    jobs.forEach(job => {
        if (job.companyId) {
            jobToCompanyMap[job.id] = job.companyId;
            if (statsMap[job.companyId]) statsMap[job.companyId].totalJobs++;
        }
    });

    internships.forEach(internship => {
        if (internship.companyId) {
            jobToCompanyMap[internship.id] = internship.companyId;
            if (statsMap[internship.companyId]) statsMap[internship.companyId].totalJobs++;
        }
    });

    applications.forEach(app => {
        const companyId = app.jobId ? jobToCompanyMap[app.jobId] : (app.internshipId ? jobToCompanyMap[app.internshipId] : null);
        if (companyId && statsMap[companyId]) {
            statsMap[companyId].totalApplicants++;
        }
    });

    return Object.values(statsMap).filter(c => c.totalJobs > 0);
}

export async function getCompanyJobsStats(companyId: string) {
    const user = await currentUser();
    if (!user || user.publicMetadata?.role !== "admin") return [];

    const jobs = await db.select({ 
        id: jobsTable.id, 
        title: jobsTable.title, 
        createdAt: jobsTable.postedAt,
        category: sql<string>`'Job'`
    }).from(jobsTable).where(eq(jobsTable.companyId, companyId));

    const internships = await db.select({ 
        id: internshipsTable.id, 
        title: internshipsTable.title, 
        createdAt: internshipsTable.postedAt,
        category: sql<string>`'Internship'`
    }).from(internshipsTable).where(eq(internshipsTable.companyId, companyId));

    const applications = await db.select({ jobId: applicationsTable.jobId, internshipId: applicationsTable.internshipId }).from(applicationsTable);

    const merged = [...jobs, ...internships].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return merged.map(item => {
        const appCount = applications.filter(a => item.category === 'Job' ? a.jobId === item.id : a.internshipId === item.id).length;
        return {
            ...item,
            totalApplicants: appCount
        };
    });
}

export async function getJobApplicants(jobId: string, isInternship: boolean = false) {
    const user = await currentUser();
    if (!user || user.publicMetadata?.role !== "admin") return [];

    const data = await db.select({
        application: applicationsTable,
        profile: userProfilesTable
    })
    .from(applicationsTable)
    .leftJoin(userProfilesTable, eq(applicationsTable.userId, userProfilesTable.userId))
    .where(isInternship ? eq(applicationsTable.internshipId, jobId) : eq(applicationsTable.jobId, jobId))
    .orderBy(desc(applicationsTable.aiScore), desc(applicationsTable.appliedAt));

    return data.map(item => ({
        ...item.application,
        candidateName: item.profile?.name || "Unknown",
        email: item.profile?.email || "Unknown"
    }));
}

export async function runAIAnalysis(jobId: string, isInternship: boolean = false) {
    const user = await currentUser();
    if (!user || user.publicMetadata?.role !== "admin") return { success: false, error: "Unauthorized" };

    try {
        // Find Job Description
        let jobDescription = "";
        if (isInternship) {
            const [intern] = await db.select({ description: internshipsTable.description }).from(internshipsTable).where(eq(internshipsTable.id, jobId)).limit(1);
            if (intern) jobDescription = intern.description;
        } else {
            const [job] = await db.select({ description: jobsTable.description }).from(jobsTable).where(eq(jobsTable.id, jobId)).limit(1);
            if (job) jobDescription = job.description;
        }

        if (!jobDescription) return { success: false, error: "Position not found or missing description." };

        // Fetch Applicants with resumes
        const applicants = await db.select({ 
            id: applicationsTable.id, 
            resumeUrl: applicationsTable.resumeUrl,
            userId: applicationsTable.userId
        }).from(applicationsTable)
        .where(isInternship ? eq(applicationsTable.internshipId, jobId) : eq(applicationsTable.jobId, jobId));

        const validApplicants = applicants.filter(a => a.resumeUrl);
        if (validApplicants.length === 0) return { success: false, error: "No applicants with resume URLs found to analyze." };

        const formData = new FormData();
        formData.append("jd", jobDescription);

        // Fetch each file and append
        for (const app of validApplicants) {
            try {
                const res = await fetch(app.resumeUrl!);
                if (!res.ok) continue;
                const blob = await res.blob();
                // Name the file according to applicant ID so the ML backend can identify it
                formData.append("files", blob, `applicant_${app.id}.pdf`);
            } catch (err) {
                console.error("Failed to fetch resume for", app.id);
            }
        }

        const aiUrl = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";
        const response = await fetch(`${aiUrl}/start-job`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            let errText = await response.text();
            throw new Error(`AI Model returned status: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        
        if (data.candidates && Array.isArray(data.candidates)) {
            for (const candidate of data.candidates) {
                 const fileName = candidate.file_name || "";
                 const match = fileName.match(/applicant_([^.]+)\.pdf/i);
                 if (match && match[1]) {
                     const applicantId = match[1];
                     
                     const skillsMatched = candidate.key_skills || [];
                     const skillsMissing = candidate.missing_skills || [];
                     const combinedSkills = [
                         ...skillsMatched.map((s: string) => ({ name: s, matched: true })),
                         ...skillsMissing.map((s: string) => ({ name: s, matched: false }))
                     ];

                     await db.update(applicationsTable).set({
                         aiScore: String(candidate.score || 0),
                         aiClassification: candidate.classification || "Unknown",
                         aiSummary: candidate.summary || "",
                         aiSkillsMatched: JSON.stringify(combinedSkills),
                         aiAnalyzed: true,
                         aiAnalyzedAt: new Date()
                     }).where(eq(applicationsTable.id, applicantId));
                 }
            }
        }

        revalidatePath("/admin/applications");
        return { success: true, message: "Analysis completed successfully." };
    } catch (error: any) {
        console.error("AI Analysis error:", error);
        return { success: false, error: error.message };
    }
}
