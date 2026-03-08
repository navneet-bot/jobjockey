"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { PreFooterCTA } from "@/components/PreFooterCTA";
import {
  Briefcase,
  Search,
  Zap,
  Star,
  BookOpen,
  ArrowRight,
  User,
  Medal,
  CheckCircle,
  Building2,
  Users,
  Settings,
  PlusCircle,
  FileText
} from "lucide-react";
import Link from "next/link";
import SectionReveal from "@/components/ui/SectionReveal";

export default function CompanyHome({ companyData }: { companyData: any }) {
  const companyName = companyData.companyName || "Employer";

  return (
    <div className="flex flex-col gap-24 pb-24 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 min-h-[70vh] flex items-center justify-center">

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-10 relative z-10">
          <SectionReveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 dark:border-[var(--primary)]/30 bg-[var(--glass-bg)] text-[var(--text-main)] text-sm font-medium mb-4 group cursor-default">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Welcome Back, {companyName}</span>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-[var(--text-main)] tracking-tight leading-[1.1]">
              Build Your <br />
              <span className="text-[var(--text-main)] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-[var(--primary)] dark:to-[var(--primary)]">Dream Team</span>
            </h1>
          </SectionReveal>

          <SectionReveal delay={0.3}>
            <p className="text-xl text-[var(--text-dim)] max-w-3xl leading-relaxed">
              Post job openings, review top candidate applications, and hire the best talent directly from the Job Jockey network.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-8 w-full sm:w-auto">
              <Link href="/business/post-job" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#111827] dark:bg-white text-white dark:text-black border border-[#111827] dark:border-white/10 font-bold text-lg shadow-lg transition-all duration-200 ease-out flex items-center justify-center gap-2 group"
                >
                  <PlusCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Create a post
                </motion.button>
              </Link>
              <Link href="/business/dashboard" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--glass-bg)] border border-[#9ca3af] dark:border-white/10 text-[var(--text-main)] font-medium text-lg hover:border-black/20 dark:hover:border-white/20 transition-all duration-200 ease-out backdrop-blur-md flex items-center justify-center gap-2 group"
                >
                  <Building2 className="w-5 h-5 transition-transform" />
                  Employer Dashboard
                </motion.button>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* QUICK ACTIONS SECTION */}
      <section className="container mx-auto px-6">
        <SectionReveal className="text-center mb-12">
          <GradientHeader
            align="center"
            title="Ease your work"
            subtitle=""
          />
        </SectionReveal>

        <SectionReveal stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div whileHover={{ scale: 1.02, y: -4 }} className="h-full">
            <GlassCard className="h-full p-8 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(var(--primary-rgb),0.15)] hover:border-[var(--primary)]/40">
              <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-blue-500/10 flex items-center justify-center border border-black/10 dark:border-blue-500/20 shadow-sm relative">
                <Users className="w-8 h-8 text-[#111827] dark:text-blue-400" />
              </div>
              <h4 className="text-xl font-bold text-[var(--text-main)]">Review Applicants</h4>
              <p className="text-[var(--text-dim)]">Efficiently screen and shortlist candidates who have applied to your active job postings.</p>
              <Link href="/business/dashboard?tab=applications" className="mt-auto pt-4 text-blue-400 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                View Applicants <ArrowRight className="w-4 h-4" />
              </Link>
            </GlassCard>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -4 }} className="h-full">
            <GlassCard className="h-full p-8 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(var(--primary-rgb),0.15)] hover:border-[var(--primary)]/40">
              <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-[var(--primary)]/10 flex items-center justify-center border border-black/10 dark:border-[var(--primary)]/20 shadow-sm relative">
                <Briefcase className="w-8 h-8 text-[#111827] dark:text-[var(--primary)]" />
              </div>
              <h4 className="text-xl font-bold text-[var(--text-main)]">Manage Active Jobs</h4>
              <p className="text-[var(--text-dim)]">Keep your job postings up to date, close fulfilled roles, and analyze engagement metrics.</p>
              <Link href="/business/dashboard?tab=jobs" className="mt-auto pt-4 text-[#111827] dark:text-[var(--primary)] font-bold flex items-center gap-1 hover:gap-2 transition-all">
                Active Listings <ArrowRight className="w-4 h-4" />
              </Link>
            </GlassCard>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -4 }} className="h-full">
            <GlassCard className="h-full p-8 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(var(--primary-rgb),0.15)] hover:border-[var(--primary)]/40">
              <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-purple-500/10 flex items-center justify-center border border-black/10 dark:border-purple-500/20 shadow-sm relative">
                <Settings className="w-8 h-8 text-[#111827] dark:text-purple-400" />
              </div>
              <h4 className="text-xl font-bold text-[var(--text-main)]">Company Profile</h4>
              <p className="text-[var(--text-dim)]">Update your company details and brand to attract the best talent on the platform.</p>
              <Link href="/business/dashboard?tab=profile" className="mt-auto pt-4 text-purple-400 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                Edit Profile <ArrowRight className="w-4 h-4" />
              </Link>
            </GlassCard>
          </motion.div>
        </SectionReveal>
      </section>

      {/* CALL TO ACTION */}
      <section className="container mx-auto px-6 relative my-12" id="updates">
        <GlassCard className="max-w-4xl mx-auto p-12 flex flex-col items-center text-center gap-6 border-black/10 dark:border-[var(--primary)]/30 shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)]">
          <FileText className="w-12 h-12 text-[#111827] dark:text-[var(--primary)]" />
          <h3 className="text-3xl font-bold text-[var(--text-main)]">Streamline your workforce</h3>
          <p className="text-[var(--text-dim)] text-lg max-w-2xl">
            Let Job Jockey help coordinate interviews, handle shortlisting, and connect you with thoroughly vetted candidates.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 rounded-full px-8 py-3 bg-[#111827] dark:bg-white text-white dark:text-black font-bold text-lg transition-all duration-200 shadow-lg"
          >
            Contact Support
          </motion.button>
        </GlassCard>
      </section>
    </div>
  );
}
