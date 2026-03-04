import { AdminCompanyTable } from "@/components/features/admin/AdminCompanyTable";
import { GradientHeader } from "@/components/ui/GradientHeader";

export default function AdminCompaniesPage() {
    return (
        <div className="flex flex-col gap-10">
            <GradientHeader
                align="left"
                title="Approved Companies"
                subtitle="Manage verified employers, view their job listings, and process candidates."
            />
            <AdminCompanyTable statusFilter="approved" />
        </div>
    );
}
