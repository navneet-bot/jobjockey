import { GlassCard } from "@/components/ui/GlassCard";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { GradientButton } from "@/components/ui/GradientButton";
import Link from "next/link";
import { User, FileText, Search } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { userProfilesTable, companiesTable } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "JobJockey - User Dashboard",
};

export default async function UserDashboardPage() {
  const { userId } = await auth();
  
  if (userId) {
    const [talentProfile] = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.userId, userId))
      .limit(1);

    if (talentProfile) {
      redirect("/talent/dashboard");
    }

    const [businessProfile] = await db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.userId, userId))
      .limit(1);

    if (businessProfile) {
      redirect("/business/dashboard");
    }
  }

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto pt-10 px-4 md:px-0 pb-20">
      <GradientHeader
        align="left"
        title="Your Dashboard"
        subtitle="Manage your profile, track active applications, and discover new opportunities."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-8 flex flex-col items-center text-center gap-4 hoverLift">
          <div className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center mb-2">
            <User className="w-8 h-8 text-[var(--primary)]" />
          </div>
          <h3 className="text-xl font-bold text-white">Candidate Profile</h3>
          <p className="text-muted-foreground text-sm">Update your details, upload your latest resume, and make yourself stand out to employers.</p>
          <Link href="/talent/create-profile" className="mt-4 w-full">
            <GradientButton className="w-full">Edit Profile</GradientButton>
          </Link>
        </GlassCard>

        <GlassCard className="p-8 flex flex-col items-center text-center gap-4 hoverLift">
          <div className="w-16 h-16 rounded-full bg-[var(--glass-border)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center mb-2">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">My Applications</h3>
          <p className="text-muted-foreground text-sm">Track your progress and respond to recruiter feedback regarding your active job pursuits.</p>
          <Link href="/applications" className="mt-4 w-full">
            <GradientButton variant="outline" className="w-full text-white border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10">
              View Applications
            </GradientButton>
          </Link>
        </GlassCard>
      </div>

      <GlassCard className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6 p-8 border-[var(--primary)] border-opacity-30 bg-gradient-to-r from-[rgba(255,255,255,0.05)] to-transparent">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Ready for a new career?</h3>
          <p className="text-muted-foreground text-sm max-w-lg">Explore thousands of job postings, internships, and specialized training programs matching your ambition.</p>
        </div>
        <Link href="/jobs" className="shrink-0">
          <GradientButton className="flex items-center gap-2">
            <Search className="w-4 h-4 text-black" /> Browse Opportunities
          </GradientButton>
        </Link>
      </GlassCard>
    </div>
  );
}
