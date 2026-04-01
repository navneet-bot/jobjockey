"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonInput } from "@/components/ui/NeonInput";
import { Search, Briefcase, Filter } from "lucide-react";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ApplicantFiltersProps {
    onFilterChange: (filters: any) => void;
    filters: any;
}

export function ApplicantFilters({ onFilterChange, filters }: ApplicantFiltersProps) {
    const handleChange = (key: string, value: string) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        onFilterChange({
            search: "",
            jobTitle: "",
            status: "all",
            fromDate: "",
            toDate: ""
        });
    };

    return (
        <GlassCard className="p-4 rounded-[20px] mb-6 overflow-visible border-black/5 dark:border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Candidate</label>
                    <NeonInput 
                        placeholder="Search candidate..." 
                        icon={<Search className="w-4 h-4" />}
                        value={filters.search}
                        onChange={(e) => handleChange("search", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Job Title</label>
                    <NeonInput 
                        placeholder="Filter by title..." 
                        icon={<Briefcase className="w-4 h-4" />}
                        value={filters.jobTitle}
                        onChange={(e) => handleChange("jobTitle", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Status</label>
                    <Select value={filters.status} onValueChange={(val) => handleChange("status", val)}>
                        <SelectTrigger className="h-12 bg-black/5 dark:bg-[var(--glass-bg)] border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-[#0A0F1F] border-black/10 dark:border-white/10 text-black dark:text-white">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="shortlisted">Shortlisted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">From Date</label>
                    <NeonInput 
                        type="date"
                        value={filters.fromDate}
                        onChange={(e) => handleChange("fromDate", e.target.value)}
                        className="appearance-none"
                    />
                </div>

                <div className="flex gap-2 items-center">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">To Date</label>
                        <NeonInput 
                            type="date"
                            value={filters.toDate}
                            onChange={(e) => handleChange("toDate", e.target.value)}
                        />
                    </div>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="mt-6 h-12 w-12 rounded-xl border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black dark:text-white shadow-sm hover:bg-black/10 dark:hover:bg-white/10"
                        onClick={clearFilters}
                        title="Clear Filters"
                    >
                        <Filter className="w-4 h-4 opacity-70" />
                    </Button>
                </div>
            </div>
        </GlassCard>
    );
}
