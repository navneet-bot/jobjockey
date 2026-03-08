import { getJobs } from "@/actions/jobActions";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { JobFeed } from "@/components/features/job/JobFeed";
import { Briefcase } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
    const allJobs = await getJobs();
    const jobs = allJobs.filter(j => j.jobCategory === "job" && j.isApproved);

    return (
        <div className="flex flex-col gap-10 pb-20">
            <GradientHeader
                title="Explore Full-Time Jobs"
                subtitle="Find the perfect role that matches your skills at top verified companies."
                badge={
                    <>
                        <Briefcase className="w-5 h-5" />
                        <span>Career Opportunities</span>
                    </>
                }
            />

            <JobFeed initialJobs={jobs} />
        </div>
    );
}
