import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { applicationsTable, jobsTable, internshipsTable, userProfilesTable } from "@/lib/schema";
import { eq, and, gte, lte, or, ilike, desc, ne } from "drizzle-orm";
import { Parser } from "json2csv";

export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = user.publicMetadata?.role as string | undefined;
    const userId = user.id;

    if (role !== "admin" && role !== "company") {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const title = searchParams.get("title");
    const status = searchParams.get("status");
    const candidateName = searchParams.get("candidateName");

    try {
        let whereClauses: any[] = [];

        // Role-based access control
        if (role === "company") {
            // Company sees their own jobs/internships
            whereClauses.push(
                or(
                    eq(jobsTable.postedBy, userId),
                    eq(internshipsTable.postedBy, userId)
                )
            );
            // Employer cannot process candidates still in "pending" status (must be shortlisted by Admin)
            whereClauses.push(ne(applicationsTable.status, "pending"));
        }

        // Filters
        if (from) {
            whereClauses.push(gte(applicationsTable.appliedAt, new Date(from)));
        }
        if (to) {
            whereClauses.push(lte(applicationsTable.appliedAt, new Date(to)));
        }
        if (status && status !== "all") {
            whereClauses.push(eq(applicationsTable.status, status as any));
        }

        // Fetch data
        const data = await db.select({
            application: applicationsTable,
            job: jobsTable,
            internship: internshipsTable,
            profile: userProfilesTable
        })
            .from(applicationsTable)
            .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
            .leftJoin(internshipsTable, eq(applicationsTable.internshipId, internshipsTable.id))
            .leftJoin(userProfilesTable, eq(applicationsTable.userId, userProfilesTable.userId))
            .where(and(...whereClauses))
            .orderBy(desc(applicationsTable.appliedAt));

        // Filter by title and candidate name in memory (due to joins/complexities)
        let filteredData = data;

        if (title) {
            const lowerTitle = title.toLowerCase();
            filteredData = filteredData.filter(row => 
                (row.job?.title?.toLowerCase().includes(lowerTitle)) || 
                (row.internship?.title?.toLowerCase().includes(lowerTitle))
            );
        }

        const client = await clerkClient();
        
        // Enrich with Clerk data if profile name is missing and filter by candidate name
        const enrichedData = await Promise.all(filteredData.map(async (row) => {
            let name = row.profile?.name;
            let email = row.profile?.email;
            let phone = row.profile?.phone;

            if (!name || !email) {
                try {
                    const clerkUser = await client.users.getUser(row.application.userId);
                    name = name || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Unknown';
                    email = email || clerkUser.emailAddresses[0]?.emailAddress || 'Unknown';
                    phone = phone || clerkUser.phoneNumbers[0]?.phoneNumber || 'Unknown';
                } catch (e) {
                    console.error("Failed to fetch Clerk user", e);
                }
            }

            return {
                id: row.application.id,
                name: name || 'Unknown',
                email: email || 'Unknown',
                phone: phone || 'Unknown',
                position: row.job?.title || row.internship?.title || "Deleted Position",
                company: row.job?.company || row.internship?.company || "Unknown Company",
                type: row.job ? "Job" : "Internship",
                status: row.application.status,
                appliedDate: row.application.appliedAt.toISOString().split('T')[0],
                resumeUrl: row.application.resumeUrl
            };
        }));

        let finalData = enrichedData;
        if (candidateName) {
            const lowerName = candidateName.toLowerCase();
            finalData = finalData.filter(row => row.name.toLowerCase().includes(lowerName));
        }

        // Convert to CSV
        const fields = [
            { label: 'Application ID', value: 'id' },
            { label: 'Candidate Name', value: 'name' },
            { label: 'Candidate Email', value: 'email' },
            { label: 'Candidate Phone', value: 'phone' },
            { label: 'Job Title', value: 'position' },
            { label: 'Company Name', value: 'company' },
            { label: 'Application Type', value: 'type' },
            { label: 'Status', value: 'status' },
            { label: 'Applied Date', value: 'appliedDate' },
            { label: 'Resume Link', value: 'resumeUrl' }
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(finalData);

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        const filename = `applications_export_${dateStr}.csv`;

        return new Response(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename=${filename}`
            }
        });

    } catch (err: any) {
        console.error("Export failed:", err);
        return NextResponse.json({ error: "Failed to generate CSV" }, { status: 500 });
    }
}
