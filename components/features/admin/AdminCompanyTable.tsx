"use client";

import { useEffect, useState } from "react";
import { getCompanyEnquiries, updateEnquiryStatus, deleteCompanyAction } from "@/actions/enquiryActions";
import { CompanyEnquiry } from "@/lib/schema";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Check, X, Eye, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { GlassModal, GlassModalContent, GlassModalHeader, GlassModalTitle, GlassModalDescription } from "@/components/ui/GlassModal";

export function AdminCompanyTable({ statusFilter }: { statusFilter?: "pending" | "approved" | "rejected" }) {
    const [enquiries, setEnquiries] = useState<CompanyEnquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalJobs, setTotalJobs] = useState<Record<string, number>>({});
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [companyToDelete, setCompanyToDelete] = useState<CompanyEnquiry | null>(null);

    async function loadData() {
        setLoading(true);
        const data = await getCompanyEnquiries(statusFilter);
        setEnquiries(data);
        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleStatusChange = async (id: string, status: "approved" | "rejected") => {
        const res = await updateEnquiryStatus(id, status);
        if (res.success) {
            toast.success(`Company ${status} successfully.`);
            loadData();
        } else {
            toast.error(res.error || "Failed to update status.");
        }
    };

    const handleDeleteCompany = async () => {
        if (!companyToDelete) return;
        setDeletingId(companyToDelete.id);
        const res = await deleteCompanyAction(companyToDelete.id);
        setDeletingId(null);
        setCompanyToDelete(null);

        if (res.success) {
            toast.success("Company removed successfully.");
            loadData();
        } else {
            toast.error(res.error || "Failed to remove company.");
        }
    };

    return (
        <>
            <GlassCard className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[var(--glass-bg)] border-b border-[var(--glass-border)] text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-medium">Company Details</th>
                                <th className="px-6 py-4 font-medium">Contact</th>
                                <th className="px-6 py-4 font-medium">Size</th>
                                <th className="px-6 py-4 font-medium">GST</th>
                                <th className="px-6 py-4 font-medium text-center">Status</th>
                                {statusFilter === 'approved' && <th className="px-6 py-4 font-medium text-center">Total Jobs</th>}
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--glass-border)] text-[var(--text-main)]">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-10 text-center"><div className="inline-block w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div></td></tr>
                            ) : enquiries.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No enquiries found.</td></tr>
                            ) : (
                                enquiries.map((enq) => (
                                    <tr key={enq.id} className="hover:bg-[var(--glass-bg)] transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-base">{enq.companyName}</p>
                                            {enq.companyUrl && (
                                                <a href={enq.companyUrl} target="_blank" rel="noreferrer" className="text-xs text-[var(--text-main)] hover:text-[var(--primary)] transition-colors hover:underline">
                                                    {enq.companyUrl}
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 flex flex-col gap-1 text-muted-foreground">
                                            <span>{enq.email}</span>
                                            <span className="text-xs">{enq.phone}</span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{enq.companySize}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{enq.gstNumber || "N/A"}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${enq.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                enq.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                }`}>
                                                {enq.status.charAt(0).toUpperCase() + enq.status.slice(1)}
                                            </span>
                                        </td>
                                        {statusFilter === 'approved' && (
                                            <td className="px-6 py-4 text-center text-muted-foreground">
                                                {/* Placeholder for total jobs count - would require a join or separate fetch in a real app */}
                                                0
                                            </td>
                                        )}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/companies/${enq.id}`}
                                                    title="View Details"
                                                    className="p-2 rounded-full bg-black/5 dark:bg-white/10 text-[var(--text-main)] dark:text-[var(--primary)] hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                {enq.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(enq.id, 'approved')}
                                                            title="Approve"
                                                            className="p-2 rounded-full bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(enq.id, 'rejected')}
                                                            title="Reject"
                                                            className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {statusFilter === 'approved' && (
                                                    <button
                                                        onClick={() => setCompanyToDelete(enq)}
                                                        title="Remove Company"
                                                        disabled={deletingId === enq.id}
                                                        className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                                    >
                                                        {deletingId === enq.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            <GlassModal open={!!companyToDelete} onOpenChange={(open) => !open && setCompanyToDelete(null)}>
                <GlassModalContent>
                    <GlassModalHeader>
                        <GlassModalTitle>Remove Company</GlassModalTitle>
                        <GlassModalDescription>
                            Are you sure you want to remove the company <span className="text-white font-medium">{companyToDelete?.companyName}</span>? This will also permanently delete all jobs associated with this company. This action cannot be undone.
                        </GlassModalDescription>
                    </GlassModalHeader>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setCompanyToDelete(null)}
                            disabled={deletingId !== null}
                            className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--glass-border)] text-[var(--text-main)] hover:bg-white/5 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteCompany}
                            disabled={deletingId !== null}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {deletingId !== null ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Removing...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    Remove Company
                                </>
                            )}
                        </button>
                    </div>
                </GlassModalContent>
            </GlassModal>
        </>
    );
}
