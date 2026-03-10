import { getCompanyEnquiries } from "@/actions/enquiryActions";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { CompanyDetailsView } from "@/components/features/admin/CompanyDetailsView";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AdminCompanyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const enquiries = await getCompanyEnquiries();
    const company = enquiries.find((e: any) => e.id === id);

    if (!company) notFound();

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <GradientHeader
                    align="left"
                    title={company.companyName}
                    subtitle="Manage company profile, job postings, and applicant shortlisting."
                />
                <Link
                    href={company.status === 'approved' ? "/admin/companies" : "/admin/enquiries"}
                    className="px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm font-medium text-[var(--text-main)]"
                >
                    Back to List
                </Link>
            </div>

            <CompanyDetailsView company={company} />
        </div>
    );
}
