import { AdminCompanyTable } from "@/components/features/admin/AdminCompanyTable";
import { GradientHeader } from "@/components/ui/GradientHeader";

export default function AdminEnquiriesPage() {
    return (
        <div className="flex flex-col gap-10">
            <GradientHeader
                align="left"
                title="Pending Company Enquiries"
                subtitle="Review and approve employer accounts before they can post jobs."
            />
            <AdminCompanyTable statusFilter="pending" />
        </div>
    );
}
