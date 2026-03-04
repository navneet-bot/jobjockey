import { getJobs } from "@/actions/jobActions";
import { JobCard } from "@/components/ui/JobCard";
import { SidebarFilter } from "@/components/ui/SidebarFilter";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { GlassSearchBar } from "@/components/ui/GlassSearchBar";

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

            <div className="w-full max-w-3xl mx-auto">
                <GlassSearchBar placeholder="Search internship roles..." />
            </div>

            <div className="flex flex-col md:flex-row gap-8 mt-4">
                <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
                    <SidebarFilter
                        title="Type"
                        options={[
                            { label: "All Internships", value: "all" },
                            { label: "Full-time", value: "Full-time" },
                            { label: "Part-time", value: "Part-time" },
                        ]}
                        selectedValue="all"
                    />
                </aside>

                <section className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {internships.length > 0 ? internships.map(job => (
                        <JobCard key={job.id} job={job} />
                    )) : (
                        <div className="col-span-full py-20 text-center text-muted-foreground glass-panel rounded-2xl">
                            No internships found right now.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
