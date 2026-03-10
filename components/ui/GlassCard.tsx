"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    hoverLift?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ children, className, hoverLift = false, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                whileHover={hoverLift ? {
                    scale: 1.02,
                    y: -3,
                    transition: { duration: 0.15, ease: "easeOut" }
                } : undefined}
                whileTap={hoverLift ? { scale: 0.97 } : undefined}
                className={cn(
                    "relative overflow-hidden bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-2xl shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-[24px] transition-all duration-200",
                    "hover:shadow-[0_0_20px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.07)] hover:border-black/20 dark:hover:border-white/25"
                )}
                {...props}
            >
                {/* Subtle radial Inner Highlight */}
                <div
                    className="absolute inset-0 pointer-events-none rounded-[24px] bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.05),_transparent)] dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent)]"
                />
                <div className={cn("relative z-10 p-6 h-full", className)}>{children}</div>
            </motion.div>
        );
    }
);

GlassCard.displayName = "GlassCard";
