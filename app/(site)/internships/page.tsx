import { getJobs } from "@/actions/jobActions";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { JobFeed } from "@/components/features/job/JobFeed";

export const dynamic = "force-dynamic";

export default async function InternshipsPage() {
    const allJobs = await getJobs();
    const internships = allJobs.filter(j => j.jobCategory === "internship" && j.isApproved);

    return (
        <div className="flex flex-col gap-10 pb-20">
            <GradientHeader
                title="Launch Your Career"
                subtitle="Gain real-world experience through premium internships at verified companies."
                badge="Internships"
            />

            <JobFeed initialJobs={internships} />
        </div>
    );
}
