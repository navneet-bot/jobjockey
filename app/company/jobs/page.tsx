import { getMyJobs } from "@/actions/jobActions";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { GradientButton } from "@/components/ui/GradientButton";
import Link from "next/link";
import { AdminJobTable } from "@/components/features/admin/AdminJobTable";

export default async function CompanyJobsPage() {
    const jobs = await getMyJobs();

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-end">
                <GradientHeader
                    align="left"
                    title="My Jobs"
                    subtitle="View and manage the status of the job positions you have posted."
                />
                <Link href="/company/post-job" className="shrink-0">
                    <GradientButton>+ Post New Job</GradientButton>
                </Link>
            </div>

            <AdminJobTable jobs={jobs} />
        </div>
    );
}
