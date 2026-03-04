"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { slideUp, staggerContainer } from "@/lib/animation-variants";

interface SectionRevealProps {
    children: ReactNode;
    className?: string;
    stagger?: boolean;
    delay?: number;
}

export default function SectionReveal({
    children,
    className = "",
    stagger = false,
    delay = 0
}: SectionRevealProps) {
    return (
        <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger ? staggerContainer(0.1, delay) : slideUp}
            className={className}
        >
            {children}
        </motion.div>
    );
}
