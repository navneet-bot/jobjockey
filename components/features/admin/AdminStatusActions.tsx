"use client";

import { updateApplicationStatus } from "@/actions/applicationActions";
import { toast } from "sonner";
import { Check, X, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminStatusActionsProps {
    applicationId: string;
    currentStatus: string;
}

export function AdminStatusActions({ applicationId, currentStatus }: AdminStatusActionsProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAction = async (newStatus: "shortlisted" | "rejected") => {
        setLoading(true);
        const res = await updateApplicationStatus(applicationId, newStatus);
        setLoading(false);
        if (res.success) {
            toast.success(`Application ${newStatus} successfully.`);
            router.refresh();
        } else {
            toast.error(res.error || "Failed to update status.");
        }
    };

    if (currentStatus !== "pending") {
        const isShortlisted = currentStatus === "shortlisted";
        const Icon = isShortlisted ? CheckCircle2 : XCircle;
        const color = isShortlisted ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" : "bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20";

        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${color} text-xs font-bold uppercase tracking-widest`}>
                <Icon className="w-3.5 h-3.5" />
                {currentStatus}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-end gap-2">
            <button
                disabled={loading}
                onClick={() => handleAction("shortlisted")}
                className="p-2.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all disabled:opacity-50"
                title="Shortlist Candidate"
            >
                <Check className="w-4 h-4" />
            </button>
            <button
                disabled={loading}
                onClick={() => handleAction("rejected")}
                className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50"
                title="Reject Candidate"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
