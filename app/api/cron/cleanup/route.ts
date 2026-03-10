import { db } from "@/lib/db";
import { jobsTable, internshipsTable, platformSettingsTable } from "@/lib/schema";
import { lt, and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();

    // 1. Fetch platform settings
    const [settings] = await db.select().from(platformSettingsTable).limit(1);
    const autoDelete = settings?.autoDeleteExpiredPosts ?? false;

    // 2. Mark posts as expired where expiryDate < now
    const expiredJobsResult = await db
      .update(jobsTable)
      .set({ isExpired: true })
      .where(and(lt(jobsTable.expiryDate, now), eq(jobsTable.isExpired, false)));

    const expiredInternshipsResult = await db
      .update(internshipsTable)
      .set({ isExpired: true })
      .where(and(lt(internshipsTable.expiryDate, now), eq(internshipsTable.isExpired, false)));

    let deletedJobsCount = 0;
    let deletedInternshipsCount = 0;

    // 3. If auto delete is enabled, delete posts where isExpired is true
    // (We could also delete them directly in the first step, but this matches the "mark as expired" requirement better)
    if (autoDelete) {
      const deletedJobs = await db
        .delete(jobsTable)
        .where(eq(jobsTable.isExpired, true));
      
      const deletedInternships = await db
        .delete(internshipsTable)
        .where(eq(internshipsTable.isExpired, true));
      
      deletedJobsCount = deletedJobs.rowCount ?? 0;
      deletedInternshipsCount = deletedInternships.rowCount ?? 0;
    }

    return NextResponse.json({
      success: true,
      markedAsExpired: {
        jobs: expiredJobsResult.rowCount,
        internships: expiredInternshipsResult.rowCount,
      },
      deleted: autoDelete ? {
        jobs: deletedJobsCount,
        internships: deletedInternshipsCount,
      } : "disabled",
    });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
