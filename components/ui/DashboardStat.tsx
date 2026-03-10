"use client";

import { GlassCard } from "./GlassCard";
import React from "react";
import { HTMLMotionProps } from "framer-motion";
import Link from "next/link";

interface DashboardStatProps extends HTMLMotionProps<"div"> {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    href?: string;
}

export function DashboardStat({ title, value, icon, href, ...props }: DashboardStatProps) {
    const card = (
        <GlassCard 
            hoverLift 
            className={`flex items-center gap-4 h-full ${href ? 'cursor-pointer select-none' : ''}`} 
            {...props}
        >
            <div className="h-14 w-14 rounded-[16px] bg-black/5 dark:bg-[var(--accent-lime)]/10 flex items-center justify-center border border-black/10 dark:border-[var(--accent-lime)]/20 text-black dark:text-[var(--accent-lime)] shadow-sm dark:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                {icon}
            </div>
            <div>
                <p className="text-sm text-muted-foreground font-medium">{title}</p>
                <h4 className="text-2xl font-bold text-[var(--text-main)]">{value}</h4>
            </div>
        </GlassCard>
    );

    if (href) {
        return (
            <Link href={href} className="block h-full">
                {card}
            </Link>
        );
    }

    return card;
}
