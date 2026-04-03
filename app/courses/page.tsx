"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CoursesPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-20 relative">
            <div className="absolute top-8 left-8">
                <Link href="/">
                    <Button variant="ghost" className="flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Button>
                </Link>
            </div>

            <div className="text-center flex flex-col items-center max-w-3xl z-10 w-full">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mb-8 border border-border shadow-xl"
                >
                    <BookOpen className="w-12 h-12 text-foreground" />
                </motion.div>
                
                <h1 className="text-5xl md:text-7xl font-display font-bold text-[var(--text-main)] tracking-tight mb-8">
                    Job Jockey Courses
                </h1>
                
                <GlassCard className="p-8 mb-8 w-full max-w-2xl border-[var(--glass-border)] shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-vr from-[var(--primary)]/5 to-transparent pointer-events-none" />
                    <p className="text-lg md:text-xl text-[var(--text-main)] leading-relaxed font-light relative z-10">
                        Currently, we are working on this. We will be back shortly with industry-leading technical training programs.
                    </p>
                </GlassCard>

                <div className="mt-8">
                    <Link href="/">
                        <Button className="rounded-full px-8 py-6 text-lg bg-[#111827] dark:bg-white text-white dark:text-black shadow-xl hover:scale-105 transition-transform duration-200">
                            Explore Other Services
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
