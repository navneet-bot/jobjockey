import { getJobs } from "@/actions/jobActions";
import { JobCard } from "@/components/ui/JobCard";
import { SidebarFilter } from "@/components/ui/SidebarFilter";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { GlassSearchBar } from "@/components/ui/GlassSearchBar";

export const dynamic = "force-dynamic";

export default async function TrainingPage() {
    const allJobs = await getJobs();
    const trainings = allJobs.filter(j => j.jobCategory === "training" && j.isApproved);

    return (
        <div className="flex flex-col gap-10 pb-20">
            <GradientHeader
                title="Upskill & Upgrade"
                subtitle="Explore training programs designed to fast-track your skills."
                badge="Training"
            />

            <div className="w-full max-w-3xl mx-auto">
                <GlassSearchBar placeholder="Search training programs..." />
            </div>

            <div className="flex flex-col md:flex-row gap-8 mt-4">
                <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
                    <SidebarFilter
                        title="Format"
                        options={[
                            { label: "All Formats", value: "all" },
                            { label: "Remote", value: "remote" },
                            { label: "On-site", value: "onsite" }
                        ]}
                        selectedValue="all"
                    />
                </aside>

                <section className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {trainings.length > 0 ? trainings.map(job => (
                        <JobCard key={job.id} job={job} />
                    )) : (
                        <div className="col-span-full py-20 text-center text-muted-foreground glass-panel rounded-2xl">
                            No training programs found right now.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
