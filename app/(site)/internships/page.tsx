import { getInternships } from "@/actions/internshipActions";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { JobFeed } from "@/components/features/job/JobFeed";
import { GraduationCap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InternshipsPage() {
    const internships = await getInternships();
    const approvedInternships = internships.filter(i => i.isApproved);

    return (
        <div className="flex flex-col gap-10 pb-20">
            <GradientHeader
                title="Launch Your Career"
                subtitle="Gain real-world experience through premium internships at verified companies."
                badge={
                    <>
                        <GraduationCap className="w-5 h-5" />
                        <span>Internships</span>
                    </>
                }
            />

            <JobFeed initialJobs={approvedInternships} />
        </div>
    );
}
