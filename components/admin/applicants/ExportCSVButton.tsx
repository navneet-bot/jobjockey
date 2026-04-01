"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Parser } from "json2csv";

interface ExportCSVButtonProps {
    data: any[];
    filename?: string;
}

export function ExportCSVButton({ data, filename = "applicants_export.csv" }: ExportCSVButtonProps) {
    const exportToCSV = () => {
        try {
            const fields = [
                { label: "Candidate Name", value: "candidateName" },
                { label: "Email", value: "email" },
                { label: "Company", value: "companyName" },
                { label: "Job Title", value: "jobTitle" },
                { label: "Category", value: "category" },
                { label: "Status", value: "status" },
                { label: "Applied Date", value: "appliedAt" }
            ];
            const parser = new Parser({ fields });
            const csv = parser.parse(data);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Export failed", err);
        }
    };

    return (
        <Button 
            onClick={exportToCSV} 
            variant="default"
            className="bg-[#111827] hover:bg-[#1f2937] text-white border border-white/10 rounded-xl gap-2 font-semibold h-11 px-6 shadow-xl"
            disabled={data.length === 0}
        >
            <Download className="w-4 h-4" />
            Export CSV
        </Button>
    );
}
