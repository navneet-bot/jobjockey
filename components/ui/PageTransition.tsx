"use client";

import { motion } from "framer-motion";
import { pageTransitionVariants } from "@/lib/animation-variants";

export default function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
        >
            {children}
        </motion.div>
    );
}
