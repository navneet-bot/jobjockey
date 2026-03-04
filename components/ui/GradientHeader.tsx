"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GradientHeaderProps {
    title: string;
    subtitle?: string;
    badge?: string;
    align?: "left" | "center";
    className?: string;
}

export function GradientHeader({ title, subtitle, badge, align = "center", className }: GradientHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "flex flex-col gap-4",
                align === "center" ? "items-center text-center" : "items-start text-left",
                className
            )}
        >
            {badge && (
                <span className="px-4 py-1.5 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm font-medium text-[#111827] dark:text-[var(--primary)] shadow-sm dark:shadow-[0_0_15px_var(--primary-glow)]">
                    {badge}
                </span>
            )}
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display text-[var(--text-main)]">
                {title.split(' ').map((word, i, arr) => {
                    // Add gradient to the last word or specific keywords if needed, for simplicity let's gradient the last word
                    if (i === arr.length - 1 && arr.length > 1) {
                        return <span key={i} className="text-gradient"> {word}</span>;
                    }
                    return <span key={i}>{i === 0 ? word : ` ${word}`}</span>;
                })}
            </h2>
            {subtitle && (
                <p className="text-lg text-[var(--text-dim)] max-w-2xl font-medium">
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
}
