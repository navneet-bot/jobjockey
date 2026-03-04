import { getJobs } from "@/actions/jobActions";
import { JobCard } from "@/components/ui/JobCard";
import { SidebarFilter } from "@/components/ui/SidebarFilter";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { GlassSearchBar } from "@/components/ui/GlassSearchBar";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
    const allJobs = await getJobs();
    const jobs = allJobs.filter(j => j.jobCategory === "job" && j.isApproved);

    return (
        <div className="flex flex-col gap-10 pb-20">
            <GradientHeader
                title="Explore Full-Time Jobs"
                subtitle="Find the perfect role that matches your skills at top verified companies."
                badge="Career Opportunities"
            />

            <div className="w-full max-w-3xl mx-auto">
                <GlassSearchBar placeholder="Search job titles or companies..." />
            </div>

            <div className="flex flex-col md:flex-row gap-8 mt-4">
                <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
                    <SidebarFilter
                        title="Job Type"
                        options={[
                            { label: "All Types", value: "all" },
                            { label: "Full-time", value: "Full-time" },
                            { label: "Part-time", value: "Part-time" },
                            { label: "Contract", value: "Contract" },
                        ]}
                        selectedValue="all"
                    />
                    <SidebarFilter
                        title="Experience"
                        options={[
                            { label: "Any Experience", value: "all" },
                            { label: "Entry Level", value: "Entry Level" },
                            { label: "Mid-Level", value: "Mid-Level" },
                            { label: "Senior", value: "Senior" },
                            { label: "Manager", value: "Manager" },
                        ]}
                        selectedValue="all"
                    />
                </aside>

                <section className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {jobs.length > 0 ? jobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    )) : (
                        <div className="col-span-full py-20 text-center text-muted-foreground glass-panel rounded-2xl">
                            No jobs found. Check back later!
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
