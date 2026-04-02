"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonInput } from "@/components/ui/NeonInput";
import { Search, Briefcase, Filter, Star, Zap, BarChart3 } from "lucide-react";
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
    const handleChange = (key: string, value: any) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        onFilterChange({
            search: "",
            experienceLevel: "all",
            skillsKeyword: "",
            minCompletion: 0,
            page: 1,
            pageSize: 10
        });
    };

    return (
        <GlassCard className="p-6 rounded-[24px] mb-8 overflow-visible border-black/5 dark:border-white/5 bg-white/[0.03] dark:bg-black/20 shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                        <Search className="w-3 h-3 text-black dark:text-[var(--primary)]" /> Candidate Info
                    </label>
                    <NeonInput 
                        placeholder="Search name or email..." 
                        icon={<Search className="w-4 h-4 text-black dark:text-white opacity-40" />}
                        value={filters.search}
                        onChange={(e) => handleChange("search", e.target.value)}
                        className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 h-11"
                    />
                </div>

                <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                        <Star className="w-3 h-3 text-black dark:text-[var(--primary)]" /> Experience
                    </label>
                    <Select value={filters.experienceLevel} onValueChange={(val) => handleChange("experienceLevel", val)}>
                        <SelectTrigger className="h-11 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white transition-all hover:bg-black/10 dark:hover:bg-white/10">
                            <SelectValue placeholder="All Levels" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-[#0A0F1F] border-black/10 dark:border-white/10 text-black dark:text-white rounded-xl shadow-2xl">
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="Entry Level">Entry Level</SelectItem>
                            <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                            <SelectItem value="Senior">Senior</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                        <Zap className="w-3 h-3 text-black dark:text-[var(--primary)]" /> Skills Keyword
                    </label>
                    <NeonInput 
                        placeholder="e.g. React, Docker, Python..." 
                        icon={<Briefcase className="w-4 h-4 text-black dark:text-white opacity-40" />}
                        value={filters.skillsKeyword}
                        onChange={(e) => handleChange("skillsKeyword", e.target.value)}
                        className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 h-11"
                    />
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex-1 space-y-2.5">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                            <BarChart3 className="w-3 h-3 text-black dark:text-[var(--primary)]" /> Profile Status
                        </label>
                        <Select value={String(filters.minCompletion)} onValueChange={(val) => handleChange("minCompletion", Number(val))}>
                            <SelectTrigger className="h-11 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white transition-all hover:bg-black/10 dark:hover:bg-white/10">
                                <SelectValue placeholder="Any Completion" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-[#0A0F1F] border-black/10 dark:border-white/10 text-black dark:text-white rounded-xl shadow-2xl">
                                <SelectItem value="0">Any Completion</SelectItem>
                                <SelectItem value="50">50% + Complete</SelectItem>
                                <SelectItem value="75">75% + Complete</SelectItem>
                                <SelectItem value="90">90% + Complete</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="mt-7 h-11 w-11 rounded-xl border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black dark:text-white shadow-sm hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 transition-all group"
                        onClick={clearFilters}
                        title="Reset Filters"
                    >
                        <Filter className="w-4 h-4 text-black dark:text-white opacity-70 group-hover:scale-110 transition-transform" />
                    </Button>
                </div>
            </div>
        </GlassCard>
    );
}
