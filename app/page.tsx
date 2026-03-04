"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { PreFooterCTA } from "@/components/PreFooterCTA";
import {
  Briefcase,
  Building2,
  GraduationCap,
  Users,
  CheckCircle,
  Zap,
  Globe,
  TrendingUp,
  Laptop,
  Headset,
  Settings
} from "lucide-react";
import Link from "next/link";
import SectionReveal from "@/components/ui/SectionReveal";
import LottieAnimation from "@/components/ui/LottieAnimation";
import { staggerContainer } from "@/lib/animation-variants";

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-24 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 min-h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-[var(--mesh-1)] rounded-full blur-[100px] animate-pulse opacity-50" />
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-[var(--mesh-2)] rounded-full blur-[120px] animate-pulse delay-700 opacity-50" />
        </div>

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-10 relative z-10">
          <SectionReveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 dark:border-[var(--primary)]/30 bg-[var(--glass-bg)] text-[var(--text-main)] text-sm font-medium mb-4 group cursor-default">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <Zap className="w-4 h-4 text-[#111827] dark:text-[var(--primary)]" />
              </motion.div>
              <span>Welcome to Job Jockey</span>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-[var(--text-main)] tracking-tight leading-[1.1]">
              Hire Skilled Talent. <br />
              <span className="text-[var(--text-main)] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-[var(--primary)] dark:to-[var(--primary)]">Start Your Remote Career.</span>
            </h1>
          </SectionReveal>

          <SectionReveal delay={0.3}>
            <p className="text-xl text-[var(--text-dim)] max-w-3xl leading-relaxed">
              Job Jockey helps companies hire trained candidates. We also help students and freshers learn practical skills and get remote jobs or internships.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-8 w-full sm:w-auto">
              <Link href="/enquiry" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#111827] dark:bg-white text-white dark:text-black border border-[#111827] dark:border-white/10 font-bold text-lg shadow-lg dark:hover:shadow-[0_0_30px_var(--primary-glow)] transition-all duration-200 ease-out flex items-center justify-center gap-2 group"
                >
                  <Building2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Post A Job
                </motion.button>
              </Link>
              <Link href="/jobs" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--glass-bg)] border border-[#9ca3af] dark:border-white/10 text-[var(--text-main)] font-medium text-lg hover:border-black/20 dark:hover:border-white/20 transition-all duration-200 ease-out backdrop-blur-md flex items-center justify-center gap-2 group"
                >
                  <Briefcase className="w-5 h-5 group-hover:rotate-[-10deg] transition-transform" />
                  Start Your Career
                </motion.button>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="container mx-auto px-6 overflow-hidden" id="about">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <SectionReveal className="w-full lg:w-1/2 flex flex-col gap-8">
            <GradientHeader
              align="left"
              badge="About Job Jockey"
              title="Connecting Talent with Opportunity"
              subtitle=""
            />
            <div className="flex flex-col gap-6 text-lg text-[var(--text-dim)]">
              <p>
                Job Jockey helps companies and job seekers connect easily. We bridge the gap between academic knowledge and industry requirements.
              </p>
              <p>
                We train candidates based on the company’s tools and working style before they start the job. This helps companies save time and hire people who are ready to work from day one.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal className="w-full lg:w-1/2">
            <GlassCard className="relative p-8 overflow-hidden aspect-video flex items-center justify-center border-[var(--primary)]/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] group">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent z-0 group-hover:opacity-60 transition-opacity" />
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <LottieAnimation
                  animationPath="https://assets10.lottiefiles.com/packages/lf20_96bovdur.json"
                  className="w-full max-w-sm"
                />
              </div>
            </GlassCard>
          </SectionReveal>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="container mx-auto px-6">
        <SectionReveal>
          <GradientHeader
            title="What Makes Us Different"
            subtitle="Tailored solutions for both employers and job seekers."
          />
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          <SectionReveal stagger className="flex flex-col gap-6">
            <h3 className="text-2xl font-display font-bold text-[#111827] dark:text-[var(--primary)] flex items-center gap-3">
              <Building2 className="w-6 h-6" /> For Companies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Candidates are trained for your specific tools and work process",
                "Less training time after hiring",
                "Faster joining process",
                "Simple and quick hiring process"
              ].map((text, i) => (
                <motion.div key={i} whileHover={{ scale: 1.03, y: -4 }}>
                  <GlassCard className="h-full p-6 border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-[var(--primary)]/50 transition-colors">
                    <CheckCircle className="w-6 h-6 text-[#111827] dark:text-[var(--primary)] mb-4" />
                    <p className="text-[var(--text-dim)]">{text}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal stagger delay={0.2} className="flex flex-col gap-6">
            <h3 className="text-2xl font-display font-bold text-[#111827] dark:text-[var(--text-main)] flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-[#111827] dark:text-[var(--primary)]" /> For Candidates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Remote internships",
                "Practical skill training",
                "Training based on real company work",
                "Job opportunities in IT, Sales, BPO and more"
              ].map((text, i) => (
                <motion.div key={i} whileHover={{ scale: 1.03, y: -4 }}>
                  <GlassCard className="h-full p-6 border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-[var(--primary)]/50 transition-colors">
                    <CheckCircle className="w-6 h-6 text-[#111827] dark:text-[var(--primary)] mb-4" />
                    <p className="text-[var(--text-dim)]">{text}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container mx-auto px-6">
        <SectionReveal>
          <GradientHeader
            title="Our Services"
            subtitle="Comprehensive hiring and training solutions."
          />
        </SectionReveal>
        <SectionReveal stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {[
            { icon: Settings, title: "Workflow-Based Hiring", desc: "We train candidates based on your company tools and systems before they join." },
            { icon: Laptop, title: "IT & Tech Hiring", desc: "Ready-to-work developers, testers, and tech professionals." },
            { icon: Headset, title: "BPO & Voice Process Hiring", desc: "Communication-trained candidates for international customer support." },
            { icon: TrendingUp, title: "Remote Sales Hiring", desc: "Sales professionals trained to generate leads and close deals remotely." },
            { icon: GraduationCap, title: "Remote Internships & Training", desc: "Internship programs for students and freshers to gain real work experience." }
          ].map((service, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.03, y: -4 }} className="h-full">
              <GlassCard className="h-full p-8 group">
                <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-[var(--primary)]/10 flex items-center justify-center mb-6 border border-black/10 dark:border-[var(--primary)]/20 shadow-sm transition-all group-hover:rotate-6">
                  <service.icon className="w-7 h-7 text-[#111827] dark:text-[var(--primary)]" />
                </div>
                <h4 className="text-xl font-bold text-[var(--text-main)] mb-3">{service.title}</h4>
                <p className="text-[var(--text-dim)] leading-relaxed">{service.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </SectionReveal>
      </section>

      {/* HOW IT WORKS */}
      <section className="container mx-auto px-6 relative">
        <SectionReveal>
          <GradientHeader
            title="How It Works"
            subtitle="A seamless process from start to finish."
          />
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-16 max-w-6xl mx-auto">
          {/* Companies Flow */}
          <div className="relative">
            <SectionReveal delay={0.1}>
              <h3 className="text-2xl font-bold text-[#111827] dark:text-[var(--primary)] mb-10 text-center">For Companies</h3>
            </SectionReveal>
            <div className="absolute left-8 top-20 bottom-10 w-0.5 bg-gradient-to-b from-[#111827]/50 via-[#111827]/20 dark:from-[var(--primary)]/50 dark:via-[var(--primary)]/20 to-transparent hidden sm:block" />

            <SectionReveal stagger className="flex flex-col gap-8">
              {[
                { step: 1, title: "Share your hiring needs and tools used." },
                { step: 2, title: "We train candidates according to your work process." },
                { step: 3, title: "You interview trained candidates." },
                { step: 4, title: "Hire quickly with less training required." }
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ x: 10 }} className="relative flex items-center gap-6">
                  <div className="w-16 h-16 shrink-0 rounded-full bg-[var(--bg-secondary)] border-2 border-black/10 dark:border-[var(--primary)] shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center justify-center text-xl font-bold text-[var(--text-main)] dark:text-[var(--primary)] z-10 transition-transform hover:scale-110">
                    {item.step}
                  </div>
                  <GlassCard className="flex-1 p-6 border-black/5 dark:border-white/5">
                    <p className="text-[var(--text-main)] font-medium text-lg">{item.title}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </SectionReveal>
          </div>

          {/* Candidates Flow */}
          <div className="relative">
            <SectionReveal delay={0.1}>
              <h3 className="text-2xl font-bold text-[#111827] dark:text-[var(--text-main)] mb-10 text-center">For Candidates</h3>
            </SectionReveal>
            <div className="absolute left-8 top-20 bottom-10 w-0.5 bg-gradient-to-b from-[var(--text-dim)]/50 via-[var(--text-dim)]/20 dark:from-white/30 dark:via-white/10 to-transparent hidden sm:block" />

            <SectionReveal stagger className="flex flex-col gap-8">
              {[
                { step: 1, title: "Apply for a job or internship." },
                { step: 2, title: "Complete skill assessment." },
                { step: 3, title: "Get training based on real company workflow." },
                { step: 4, title: "Get placed in an internship or job." }
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ x: 10 }} className="relative flex items-center gap-6">
                  <div className="w-16 h-16 shrink-0 rounded-full bg-[var(--bg-secondary)] border-2 border-black/10 dark:border-[var(--primary)] shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center justify-center text-xl font-bold text-[var(--text-main)] dark:text-[var(--primary)] z-10 transition-transform hover:scale-110">
                    {item.step}
                  </div>
                  <GlassCard className="flex-1 p-6 border-black/5 dark:border-white/5">
                    <p className="text-[var(--text-main)] font-medium text-lg">{item.title}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE JOB JOCKEY (Icons) */}
      <section className="container mx-auto px-6">
        <SectionReveal>
          <GradientHeader
            title="Why Choose Job Jockey"
            subtitle="Delivering value to our users every day."
          />
        </SectionReveal>

        <SectionReveal stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-12">
          {[
            { icon: Briefcase, text: "Real-world practical training" },
            { icon: Globe, text: "Focus on remote jobs" },
            { icon: GraduationCap, text: "Helps students become job-ready" },
            { icon: Building2, text: "Supports companies with trained talent" },
            { icon: Users, text: "Dedicated placement support" }
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05, rotate: 2 }}>
              <GlassCard className="h-full p-8 flex flex-col items-center text-center gap-6 border-black/5 dark:border-[var(--primary)]/20 hover:border-black/20 dark:hover:border-[var(--primary)]/60 hover:shadow-xl transition-all">
                <item.icon className="w-10 h-10 text-[#111827] dark:text-[var(--primary)]" />
                <p className="font-semibold text-[var(--text-main)]">{item.text}</p>
              </GlassCard>
            </motion.div>
          ))}
        </SectionReveal>
      </section>

      <PreFooterCTA />
    </div>
  );
}
