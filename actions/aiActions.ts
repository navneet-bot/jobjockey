"use server";

import { db } from "@/lib/db";
import {
    applicationsTable,
    jobsTable,
    internshipsTable,
    userProfilesTable
} from "@/lib/schema";

import { eq, desc } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/*
====================================================
GET APPLICANTS WITH AI SCORE
====================================================
*/

export async function getApplicantsWithScore(
    jobId: string,
    isInternship = false
) {

    const user = await currentUser();

    if (!user || user.publicMetadata?.role !== "admin") {
        return [];
    }

    const applicants = await db
        .select({
            application: applicationsTable,
            profile: userProfilesTable
        })
        .from(applicationsTable)
        .leftJoin(
            userProfilesTable,
            eq(applicationsTable.userId, userProfilesTable.userId)
        )
        .where(
            isInternship
                ? eq(applicationsTable.internshipId, jobId)
                : eq(applicationsTable.jobId, jobId)
        )
        .orderBy(
            desc(applicationsTable.aiScore),
            desc(applicationsTable.appliedAt)
        );

    return applicants.map(a => ({
        ...a.application,
        candidateName: a.profile?.name || "Unknown",
        email: a.profile?.email || "",
        aiScore: a.application.aiScore || null,
        aiSummary: a.application.aiSummary || null,
        aiAnalyzed: a.application.aiAnalyzed || false
    }));
}

/*
====================================================
RUN AI ANALYSIS
====================================================
*/

export async function runAIAnalysis(
    jobId: string,
    isInternship = false
) {

    const user = await currentUser();

    if (!user || user.publicMetadata?.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized"
        };
    }

    try {

        /*
        ======================
        GET JD
        ======================
        */

        let jobDescription = "";

        if (isInternship) {

            const [intern] = await db
                .select({
                    description: internshipsTable.description
                })
                .from(internshipsTable)
                .where(eq(internshipsTable.id, jobId))
                .limit(1);

            jobDescription = intern?.description || "";

        } else {

            const [job] = await db
                .select({
                    description: jobsTable.description
                })
                .from(jobsTable)
                .where(eq(jobsTable.id, jobId))
                .limit(1);

            jobDescription = job?.description || "";
        }

        if (!jobDescription) {

            return {
                success: false,
                error: "Job description not found"
            };

        }

        /*
        ======================
        GET RESUMES
        ======================
        */

        const applicants = await db
            .select({
                id: applicationsTable.id,
                resumeUrl: applicationsTable.resumeUrl
            })
            .from(applicationsTable)
            .where(
                isInternship
                    ? eq(applicationsTable.internshipId, jobId)
                    : eq(applicationsTable.jobId, jobId)
            );

        const validApplicants = applicants.filter(a => a.resumeUrl);

        if (validApplicants.length === 0) {

            return {
                success: false,
                error: "No resumes found"
            };

        }

        /*
        ======================
        SEND TO ML SERVER
        ======================
        */

        const formData = new FormData();

        formData.append("jd", jobDescription);

        for (const applicant of validApplicants) {

            try {

                const fileRes = await fetch(applicant.resumeUrl!);

                const blob = await fileRes.blob();

                formData.append(
                    "files",
                    blob,
                    `applicant_${applicant.id}.pdf`
                );

            } catch (err) {

                console.log(
                    "resume fetch failed",
                    applicant.id
                );

            }

        }

        const API_URL =
            process.env.NEXT_PUBLIC_AI_API_URL ||
            "http://127.0.0.1:8000";

        const response = await fetch(
            `${API_URL}/start-job`,
            {
                method: "POST",
                body: formData
            }
        );

        if (!response.ok) {

            const txt = await response.text();

            throw new Error(txt);

        }

        const data = await response.json();

        /*
        ======================
        SAVE SCORES
        ======================
        */

        if (data.candidates) {

            for (const candidate of data.candidates) {

                const fileName =
                    candidate.file_name || "";

                const match =
                    fileName.match(
                        /applicant_(.*?)\.pdf/
                    );

                if (!match) continue;

                const applicationId = match[1];

                await db
                    .update(applicationsTable)
                    .set({

                        aiScore: String(
                            candidate.score || 0
                        ),

                        aiClassification:
                            candidate.classification ||
                            "Unknown",

                        aiSummary:
                            candidate.summary || "",

                        aiAnalyzed: true,

                        aiAnalyzedAt: new Date()

                    })
                    .where(
                        eq(
                            applicationsTable.id,
                            applicationId
                        )
                    );

            }

        }

        revalidatePath("/admin/applications");

        return {
            success: true
        };

    } catch (err: any) {

        console.log(err);

        return {
            success: false,
            error: err.message
        };

    }

}