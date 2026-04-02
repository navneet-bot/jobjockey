"use server";
import { db } from "@/lib/db";
import { userProfilesTable, applicationsTable, jobsTable, internshipsTable } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc, and, ilike, sql, or } from "drizzle-orm";

export interface TalentFilterParams {
    search?: string;
    experienceLevel?: string;
    skillsKeyword?: string;
    minCompletion?: number;
    page?: number;
    pageSize?: number;
}

/**
 * Fetches all talent profiles for the admin directory.
 */
export async function getAllTalents(params: TalentFilterParams = {}) {
    const { 
        search, 
        experienceLevel, 
        skillsKeyword, 
        minCompletion = 0, 
        page = 1, 
        pageSize = 10 
    } = params;

    const user = await currentUser();
    if (!user || user.publicMetadata?.role !== "admin") {
        throw new Error("Unauthorized access to talent directory");
    }

    try {
        let whereClauses = [];

        // Search by name or email
        if (search) {
            whereClauses.push(
                or(
                    ilike(userProfilesTable.name, `%${search}%`),
                    ilike(userProfilesTable.email, `%${search}%`)
                )
            );
        }

        // Filter by Experience Level (string matching)
        if (experienceLevel && experienceLevel !== "all") {
            whereClauses.push(eq(userProfilesTable.experience, experienceLevel));
        }

        // Filter by Skills keyword
        if (skillsKeyword) {
            whereClauses.push(ilike(userProfilesTable.skills, `%${skillsKeyword}%`));
        }

        const offset = (page - 1) * pageSize;

        // Fetch profiles
        const data = await db.select()
            .from(userProfilesTable)
            .where(whereClauses.length > 0 ? and(...whereClauses) : undefined)
            .limit(pageSize)
            .offset(offset)
            .orderBy(desc(userProfilesTable.createdAt));

        // Count total for pagination
        const totalResult = await db.select({ count: sql<number>`count(*)` })
            .from(userProfilesTable)
            .where(whereClauses.length > 0 ? and(...whereClauses) : undefined);
        
        const total = Number(totalResult[0]?.count || 0);

        // Enrich with completion percentage
        const enrichedData = data.map(profile => {
            const fields = [
                profile.name, 
                profile.phone, 
                profile.email, 
                profile.education, 
                profile.skills, 
                profile.experience, 
                profile.preferredDomain, 
                profile.preferredJobType, 
                profile.portfolioUrl, 
                profile.linkedin, 
                profile.github, 
                profile.resumeUrl
            ];
            
            const filledCount = fields.filter(f => f !== null && f !== undefined && f !== "").length;
            const completionPercent = Math.round((filledCount / fields.length) * 100);

            return {
                ...profile,
                completionPercent,
                // Top 5 skills for display
                topSkills: profile.skills 
                    ? profile.skills.split(",").map(s => s.trim()).slice(0, 5) 
                    : []
            };
        });

        // If minCompletion is specified, we might need a more complex query, 
        // but for now we'll handle basic filtering. 
        // Note: Real DB-side completion filtering would required a generated column or complex SQL.
        let finalData = enrichedData;
        if (minCompletion > 0) {
            finalData = enrichedData.filter(p => p.completionPercent >= minCompletion);
        }

        return {
            data: finalData,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        };
    } catch (err: any) {
        console.error("Failed to fetch talents:", err);
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }
}

/**
 * Fetches single talent full details including application history.
 */
export async function getTalentFullDetail(talentId: string) {
    const user = await currentUser();
    if (!user || user.publicMetadata?.role !== "admin") {
        throw new Error("Unauthorized access");
    }

    try {
        // 1. Fetch Profile
        const [profile] = await db.select()
            .from(userProfilesTable)
            .where(eq(userProfilesTable.id, talentId))
            .limit(1);

        if (!profile) return null;

        // 2. Fetch Enrichment (Completion %)
        const fields = [
            profile.name, profile.phone, profile.email, profile.education, 
            profile.skills, profile.experience, profile.preferredDomain, 
            profile.preferredJobType, profile.portfolioUrl, profile.linkedin, 
            profile.github, profile.resumeUrl
        ];
        const filledCount = fields.filter(f => f !== null && f !== undefined && f !== "").length;
        const completionPercent = Math.round((filledCount / fields.length) * 100);
        const topSkills = profile.skills ? profile.skills.split(",").map(s => s.trim()) : [];

        // 3. Fetch Applications History
        const applications = await db.select({
            id: applicationsTable.id,
            status: applicationsTable.status,
            appliedAt: applicationsTable.appliedAt,
            jobId: applicationsTable.jobId,
            internshipId: applicationsTable.internshipId,
            jobTitle: jobsTable.title,
            jobCompany: jobsTable.company,
            internshipTitle: internshipsTable.title,
            internshipCompany: internshipsTable.company,
            category: sql<string>`CASE WHEN ${applicationsTable.jobId} IS NOT NULL THEN 'JOB' ELSE 'INTERNSHIP' END`,
            // AI Analysis Fields
            aiScore: applicationsTable.aiScore,
            aiAnalyzed: applicationsTable.aiAnalyzed,
            aiSummary: applicationsTable.aiSummary,
            aiClassification: applicationsTable.aiClassification,
            aiSkillMatch: applicationsTable.aiSkillMatch,
            aiStrengths: applicationsTable.aiStrengths,
            aiGaps: applicationsTable.aiGaps
        })
            .from(applicationsTable)
            .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
            .leftJoin(internshipsTable, eq(applicationsTable.internshipId, internshipsTable.id))
            .where(eq(applicationsTable.userId, profile.userId))
            .orderBy(desc(applicationsTable.appliedAt));

        return {
            profile: {
                ...profile,
                completionPercent,
                topSkills
            },
            applications: applications.map(app => ({
                id: app.id,
                status: app.status,
                appliedAt: app.appliedAt,
                title: app.jobTitle || app.internshipTitle || "Unknown Position",
                company: app.jobCompany || app.internshipCompany || "Unknown Company",
                category: app.category,
                jobId: app.jobId,
                internshipId: app.internshipId,
                // AI Fields
                aiScore: app.aiScore,
                aiAnalyzed: app.aiAnalyzed,
                aiSummary: app.aiSummary,
                aiClassification: app.aiClassification,
                aiSkillMatch: app.aiSkillMatch,
                aiStrengths: app.aiStrengths,
                aiGaps: app.aiGaps
            }))
        };
    } catch (err) {
        console.error("Failed to fetch talent detail:", err);
        return null;
    }
}
