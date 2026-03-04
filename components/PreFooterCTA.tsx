"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function PreFooterCTA() {
    return (
        <section className="relative w-full py-24 overflow-hidden border-t border-[var(--glass-border)] bg-[var(--bg-secondary)]">
            {/* Ambient Background & Glow */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Diagonal Gradient Ambient Light */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-black opacity-10 dark:bg-[var(--primary)] dark:opacity-[0.03] rounded-full blur-[120px]" />

                {/* Subtle Starfield / Particles */}
                <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-[var(--text-main)]/40 rounded-full animate-pulse blur-[1px]" />
                <div className="absolute top-[60%] left-[10%] w-1.5 h-1.5 bg-[var(--text-main)]/20 rounded-full animate-float blur-[1px]" style={{ animationDelay: '1s' }} />
                <div className="absolute top-[30%] right-[20%] w-2 h-2 bg-[#111827]/30 dark:bg-[var(--primary)]/30 rounded-full animate-pulse blur-[2px]" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[70%] right-[15%] w-1 h-1 bg-[var(--text-main)]/30 rounded-full animate-float blur-[1px]" style={{ animationDelay: '3s' }} />
                <div className="absolute top-[80%] left-[40%] w-1 h-1 bg-[#111827]/40 dark:bg-[var(--primary)]/40 rounded-full animate-pulse blur-[1px]" style={{ animationDelay: '1.5s' }} />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">

                    {/* Left: Floating 3D Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full lg:w-[45%] relative"
                    >
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
                            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg dark:shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-[var(--glass-border)] transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 bg-[var(--glass-bg)] group"
                        >
                            {/* Inner Glass Highlight */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--text-main)]/10 dark:from-white/10 to-transparent z-10 pointer-events-none" />

                            <Image
                                src="/preview/new-mock.png"
                                alt="Dashboard Preview"
                                fill
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80"
                            />
                        </motion.div>

                        {/* Underglow for the image */}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-black/25 dark:bg-[var(--primary)]/20 blur-[50px] -z-10 rounded-full" />
                    </motion.div>

                    {/* Right: Content Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="w-full lg:w-[50%] flex flex-col gap-8"
                    >
                        {/* Glass Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--glass-bg)] border border-[var(--primary)]/30 backdrop-blur-md w-fit shadow-[0_0_20px_var(--primary-glow)]">
                            <Sparkles className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
                            <span className="text-sm font-medium text-[#111827] dark:text-[var(--primary)]">
                                Introducing Job Jockey Workspace
                            </span>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] text-[var(--text-main)] tracking-tight">
                                Ready to hire trained talent or start your <span className="text-[#111827] dark:text-[var(--primary)] inline-block">remote career?</span>
                            </h2>
                            <p className="text-lg text-[var(--text-dim)] leading-relaxed max-w-xl font-body">
                                Contact Job Jockey today.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                            <Link href="/jobs" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#111827] text-white dark:bg-white dark:text-black font-bold text-lg hover:scale-105 hover:shadow-lg dark:hover:shadow-[0_0_30px_var(--primary-glow)] border border-black/10 dark:border-white/10 transition-all flex items-center justify-center gap-2 group">
                                    Get Started Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>

                            <Link href="/companies" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--glass-bg)] border border-[#9ca3af] dark:border-[var(--glass-border)] text-[var(--text-main)] font-medium text-lg hover:bg-[var(--glass-bg)] hover:border-black/20 dark:hover:border-white/20 transition-all backdrop-blur-md">
                                    View Opportunities
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
