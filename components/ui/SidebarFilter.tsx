"use client";

import { GlassCard } from "./GlassCard";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

interface FilterOption {
    value: string;
    label: string;
}

interface SidebarFilterProps {
    title: string;
    options: FilterOption[];
    selectedValue?: string;
    onChange?: (value: string) => void;
}

export function SidebarFilter({ title, options, selectedValue, onChange }: SidebarFilterProps) {
    return (
        <GlassCard className="p-5 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-foreground tracking-tight">{title}</h3>
            <RadioGroup value={selectedValue} onValueChange={onChange} className="flex flex-col gap-3">
                {options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem
                            value={option.value}
                            id={option.value}
                            className="border-[var(--primary)] text-[var(--primary)] focus-visible:ring-[var(--primary)]"
                        />
                        <Label htmlFor={option.value} className="text-[#111827]/60 dark:text-white/60 hover:text-[#111827] dark:hover:text-white transition-colors font-medium cursor-pointer">
                            {option.label}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </GlassCard>
    );
}
