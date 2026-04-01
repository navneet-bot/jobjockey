"use server";

import { db } from "@/lib/db";

import {
    applicationsTable,
    jobsTable,
    internshipsTable,
    companyEnquiriesTable,
    userProfilesTable
} from "@/lib/schema";

import { eq, desc, sql } from "drizzle-orm";

import { currentUser } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";


/*
====================================================
1. GET ALL COMPANIES WITH JOB COUNT + APPLICANTS
====================================================
*/

export async function getCompaniesWithStats() {

    const user = await currentUser();

    if (!user || user.publicMetadata?.role !== "admin")
        return [];

    const jobs =
        await db.select({
            id: jobsTable.id,
            companyId: jobsTable.companyId
        }).from(jobsTable);


    const internships =
        await db.select({
            id: internshipsTable.id,
            companyId: internshipsTable.companyId
        }).from(internshipsTable);


    const applications =
        await db.select({
            jobId: applicationsTable.jobId,
            internshipId: applicationsTable.internshipId
        }).from(applicationsTable);


    const companies =
        await db.select({
            id: companyEnquiriesTable.id,
            name: companyEnquiriesTable.companyName,
            email: companyEnquiriesTable.email
        }).from(companyEnquiriesTable);



    const statsMap:
        Record<string, any> = {};



    companies.forEach(c => {

        statsMap[c.id] = {

            id: c.id,

            name: c.name,

            email: c.email,

            totalJobs: 0,

            totalApplicants: 0

        };

    });



    const jobCompanyMap:
        Record<string, string> = {};



    jobs.forEach(j => {

        if (j.companyId) {

            jobCompanyMap[j.id] = j.companyId;

            statsMap[j.companyId].totalJobs++;

        }

    });



    internships.forEach(i => {

        if (i.companyId) {

            jobCompanyMap[i.id] = i.companyId;

            statsMap[i.companyId].totalJobs++;

        }

    });



    applications.forEach(a => {

        const companyId =
            a.jobId
                ? jobCompanyMap[a.jobId]
                : jobCompanyMap[a.internshipId!];


        if (companyId)

            statsMap[companyId].totalApplicants++;

    });



    return Object.values(statsMap)

        .filter(c => c.totalJobs > 0);

}



/*
====================================================
2. GET JOBS OF COMPANY
====================================================
*/

export async function getCompanyJobsStats(companyId: string) {

    const user = await currentUser();

    if (!user || user.publicMetadata?.role !== "admin")
        return [];



    const jobs =
        await db.select({

            id: jobsTable.id,

            title: jobsTable.title,

            createdAt: jobsTable.postedAt,

            category: sql<string>`'Job'`

        })

            .from(jobsTable)

            .where(eq(jobsTable.companyId, companyId));



    const internships =
        await db.select({

            id: internshipsTable.id,

            title: internshipsTable.title,

            createdAt: internshipsTable.postedAt,

            category: sql<string>`'Internship'`

        })

            .from(internshipsTable)

            .where(eq(internshipsTable.companyId, companyId));



    const applications =
        await db.select({

            jobId: applicationsTable.jobId,

            internshipId: applicationsTable.internshipId

        }).from(applicationsTable);



    const merged =
        [...jobs, ...internships]

            .sort(

                (a, b) =>
                    new Date(b.createdAt || 0).getTime()
                    -
                    new Date(a.createdAt || 0).getTime()

            );



    return merged.map(item => {

        const count =
            applications.filter(a =>

                item.category === "Job"

                    ? a.jobId === item.id

                    : a.internshipId === item.id

            ).length;



        return {

            ...item,

            totalApplicants: count

        };

    });

}



/*
====================================================
3. GET APPLICANTS
====================================================
*/

export async function getJobApplicants(
    jobId: string,
    isInternship: boolean = false
) {

    const user = await currentUser();

    if (!user || user.publicMetadata?.role !== "admin")
        return [];



    const data =
        await db.select({

            application: applicationsTable,

            profile: userProfilesTable

        })

            .from(applicationsTable)

            .leftJoin(

                userProfilesTable,

                eq(
                    applicationsTable.userId,
                    userProfilesTable.userId
                )

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



    return data.map(d => ({

        ...d.application,

        candidateName:
            d.profile?.name || "Unknown",

        email:
            d.profile?.email || "Unknown"

    }));

}



/*
====================================================
4. RUN AI ANALYSIS
====================================================
*/

export async function runAIAnalysis(
    jobId: string,
    isInternship: boolean = false
) {

    const user = await currentUser();

    if (!user || user.publicMetadata?.role !== "admin")

        return {

            success: false,

            error: "Unauthorized"

        };



    try {

        /*
        ------------------------------------------
        GET JD
        ------------------------------------------
        */

        let jd = "";


        if (isInternship) {

            const [intern] =
                await db.select({

                    description:
                        internshipsTable.description

                })

                    .from(internshipsTable)

                    .where(

                        eq(
                            internshipsTable.id,
                            jobId
                        )

                    )

                    .limit(1);


            jd = intern?.description || "";

        }

        else {

            const [job] =
                await db.select({

                    description:
                        jobsTable.description

                })

                    .from(jobsTable)

                    .where(

                        eq(
                            jobsTable.id,
                            jobId
                        )

                    )

                    .limit(1);


            jd = job?.description || "";

        }



        if (!jd)

            return {

                success: false,

                error: "No job description"

            };



        /*
        ------------------------------------------
        GET RESUMES
        ------------------------------------------
        */

        const applicants =
            await db.select({

                id: applicationsTable.id,

                resumeUrl:
                    applicationsTable.resumeUrl

            })

                .from(applicationsTable)

                .where(

                    isInternship

                        ? eq(
                            applicationsTable.internshipId,
                            jobId
                        )

                        : eq(
                            applicationsTable.jobId,
                            jobId
                        )

                );



        const valid =
            applicants.filter(a => a.resumeUrl);



        if (!valid.length)

            return {

                success: false,

                error: "No resumes"

            };



        /*
        ------------------------------------------
        SEND TO ML SERVER
        ------------------------------------------
        */

        const formData =
            new FormData();


        formData.append("jd", jd);



        for (const a of valid) {

            const file =
                await fetch(a.resumeUrl!);

            const blob =
                await file.blob();


            formData.append(

                "files",

                blob,

                `applicant_${a.id}.pdf`

            );

        }



        const aiUrl =
            process.env
                .NEXT_PUBLIC_AI_API_URL
            || "https://jobjockey-backend.onrender.com";



        const response = await fetch(`${aiUrl}/start-job`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[AI Analysis] ML Server returned error ${response.status}: ${errorText}`);
            return { success: false, error: `ML Server Error: ${response.status}` };
        }

        const result = await response.json();
        const candidates = result.candidates || [];
        console.log(`[AI Analysis] Received ${candidates.length} candidates from ML server`);

        /*
        ------------------------------------------
        SAVE SCORE
        ------------------------------------------
        */

        for (const c of candidates) {
            console.log(`[AI Analysis] Full candidate data:`, JSON.stringify(c));

            const fileName = c.file_name || "";
            // Robust extraction: get everything between 'applicant_' and '.pdf'
            const idMatch = fileName.match(/applicant_(.*)\.pdf/);
            const id = idMatch ? idMatch[1] : null;

            console.log(`[AI Analysis] Filename: ${fileName}, Extracted ID: ${id}`);

            if (!id) {
                console.warn(`[AI Analysis] Could not extract ID from filename: ${fileName}`);
                continue;
            }

            try {
                await db
                    .update(applicationsTable)
                    .set({
                        aiScore: String(c.score || 0),
                        aiSummary: c.summary || "No summary provided",
                        aiClassification: c.classification || "Weak",
                        aiAnalyzed: true,
                        aiAnalyzedAt: new Date()
                    })
                    .where(eq(applicationsTable.id, id));

                console.log(`[AI Analysis] Database update executed for ID: ${id}`);
            } catch (dbErr: any) {
                console.error(`[AI Analysis] Database update failed for ID ${id}:`, dbErr.message);
            }
        }



        revalidatePath("/admin/applications");



        return {

            success: true

        };

    }

    catch (err: any) {

        return {

            success: false,

            error: err.message

        };

    }

}