import { getCompanyJobsForAdmin } from "@/actions/applicationActions";
import { getCompanyEnquiries } from "@/actions/enquiryActions";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { Briefcase, Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export default async function AdminCompanyJobsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const enquiries = await getCompanyEnquiries();
    const company = enquiries.find(e => e.id === id);

    if (!company) notFound();

    const jobs = await getCompanyJobsForAdmin(id);

    return (
        <div className="flex flex-col gap-10">
            <div className="flex items-center justify-between">
                <GradientHeader
                    align="left"
                    title={`Jobs by ${company.companyName}`}
                    subtitle={`Manage all positions posted by this company and review applicant pools.`}
                />
                <Link
                    href={`/admin/companies/${id}`}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium text-white"
                >
                    Back to Details
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length === 0 ? (
                    <GlassCard className="col-span-full p-12 text-center flex flex-col items-center gap-4">
                        <Briefcase className="w-12 h-12 text-muted-foreground opacity-20" />
                        <p className="text-muted-foreground italic">No jobs have been posted by this company yet.</p>
                    </GlassCard>
                ) : (
                    jobs.map((job) => (
                        <GlassCard key={job.id} className="p-6 flex flex-col gap-6 hover:border-[var(--primary)]/30 transition-all group">
                            <div className="flex flex-col gap-2">
                                <h3 className="font-bold text-lg text-white group-hover:text-[var(--primary)] transition-colors">{job.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                                    <span className="px-2 py-0.5 bg-white/5 rounded-md border border-white/10">{job.jobType}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>Posted on {format(new Date(job.postedAt), 'MMM dd, yyyy')}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-white font-semibold">
                                    <Users className="w-4 h-4 text-[var(--primary)]" />
                                    <span>{job.applicationCount} Applications</span>
                                </div>
                            </div>

                            <Link
                                href={`/admin/jobs/${job.id}/applications`}
                                className="mt-2 w-full py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-[var(--primary)] hover:text-black transition-all flex items-center justify-center gap-2 font-bold text-sm"
                            >
                                View Applications
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </GlassCard>
                    ))
                )}
            </div>
        </div>
    );
}
