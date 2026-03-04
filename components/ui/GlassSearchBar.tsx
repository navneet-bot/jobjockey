"use client";

import { Search } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { GradientButton } from "./GradientButton";

interface GlassSearchBarProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
    className?: string;
}

export function GlassSearchBar({ placeholder = "Search for jobs, skills, or companies...", onSearch, className }: GlassSearchBarProps) {
    return (
        <GlassCard className={`p-2 pl-4 rounded-[32px] ${className || ""}`}>
            <div className="flex items-center gap-3 w-full">
                <Search className="w-5 h-5 text-[#111827]/50 dark:text-white/50" />
                <input
                    type="text"
                    placeholder={placeholder}
                    className="flex-1 bg-transparent border-none outline-none text-[#111827] dark:text-white placeholder:text-[#111827]/50 dark:placeholder:text-white/50 text-sm h-12 w-full min-w-0"
                    onChange={(e) => onSearch && onSearch(e.target.value)}
                />
                <GradientButton className="py-2.5 px-6 rounded-full text-sm shrink-0">
                    Search
                </GradientButton>
            </div>
        </GlassCard>
    );
}
