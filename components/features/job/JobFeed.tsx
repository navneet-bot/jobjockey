"use client";

import { useTransition, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Job } from "@/lib/schema";
import { JobCard } from "@/components/ui/JobCard";
import { SidebarFilter } from "@/components/ui/SidebarFilter";
import { GlassSearchBar } from "@/components/ui/GlassSearchBar";

export function JobFeed({ initialJobs }: { initialJobs: Job[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    
    // Get filter values from URL or default
    const currentJobType = searchParams.get("type") || "all";
    const currentExperience = searchParams.get("exp") || "all";
    const currentSearch = searchParams.get("q") || "";

    const [filterJobs, setFilteredJobs] = useState(initialJobs);

    useEffect(() => {
        let filtered = [...initialJobs];

        if (currentJobType !== "all") {
            filtered = filtered.filter(j => j.jobType === currentJobType);
        }

        if (currentExperience !== "all") {
            filtered = filtered.filter(j => j.experienceLevel === currentExperience);
        }

        if (currentSearch) {
            const query = currentSearch.toLowerCase();
            filtered = filtered.filter(j => 
                j.title.toLowerCase().includes(query) || 
                j.company.toLowerCase().includes(query) ||
                j.description.toLowerCase().includes(query)
            );
        }

        setFilteredJobs(filtered);
    }, [currentJobType, currentExperience, currentSearch, initialJobs]);

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all" || !value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    return (
        <>
            <div className="w-full max-w-3xl mx-auto">
                <GlassSearchBar 
                    placeholder="Search job titles or companies..." 
                    onSearch={(query) => updateFilters("q", query)}
                />
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
                        selectedValue={currentJobType}
                        onChange={(val) => updateFilters("type", val)}
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
                        selectedValue={currentExperience}
                        onChange={(val) => updateFilters("exp", val)}
                    />
                </aside>

                <section className={`flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                    {filterJobs.length > 0 ? filterJobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    )) : (
                        <div className="col-span-full py-20 text-center text-muted-foreground glass-panel rounded-2xl flex flex-col items-center gap-2">
                           <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                                <span className="text-2xl">🔍</span>
                           </div>
                            <h3 className="text-lg font-medium text-foreground">No matches found</h3>
                            <p className="max-w-xs mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
