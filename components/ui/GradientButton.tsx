"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface GradientButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "outline";
}

export const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps & HTMLMotionProps<"button">>(
    ({ children, className, variant = "primary", ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "relative flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-all duration-200 ease-out",
                    variant === "primary" &&
                    "bg-gradient-primary shadow-[0_0_20px_var(--primary-glow)] hover:shadow-[0_0_30px_var(--primary-glow)] hover:brightness-110 text-white dark:text-black ring-0 hover:ring-2 hover:ring-black/20 dark:hover:ring-white/30",
                    variant === "outline" &&
                    "border border-[rgba(255,255,255,0.35)] bg-transparent hover:bg-white/10 dark:hover:bg-white/5 hover:border-white/50 text-[var(--primary)]",
                    className
                )}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);

GradientButton.displayName = "GradientButton";
