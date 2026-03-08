"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientHeader } from "@/components/ui/GradientHeader";
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
  Settings,
  FileText
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SectionReveal from "@/components/ui/SectionReveal";
import LottieAnimation from "@/components/ui/LottieAnimation";
import { staggerContainer } from "@/lib/animation-variants";
import { ServiceCarousel } from "./ServiceCarousel";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";


export default function GuestHome() {
  return (
    <div className="flex flex-col gap-16 lg:gap-20 pb-24 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-12 px-4 min-h-[85vh] flex items-center justify-center">

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
              Build High-Performance <br />
              <span className="text-[var(--text-main)] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-[var(--primary)] dark:to-[var(--primary)]">Teams Without Hiring Hassles</span>
            </h1>
          </SectionReveal>

          <SectionReveal delay={0.3}>
            <p className="text-xl text-[var(--text-dim)] max-w-3xl leading-relaxed">
              Job Jockey connects businesses with skilled professionals and manages hiring, payroll, and workforce operations enabling companies to scale faster while providing talent with real career opportunities.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-8 w-full sm:w-auto">
              <Link href="/business/enquiry" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#111827] dark:bg-white text-white dark:text-black border border-[#111827] dark:border-white/10 font-bold text-lg shadow-lg dark:hover:shadow-[0_0_30px_var(--primary-glow)] transition-all duration-200 ease-out flex items-center justify-center gap-2 group"
                >
                  <Building2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Hire Talent
                </motion.button>
              </Link>
              <Link href="/talent/create-profile" className="w-full sm:w-auto">
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
      <section className="container mx-auto px-6 overflow-hidden min-h-screen flex flex-col justify-center py-12 gap-2" id="about">
        {/* Full Width Top Title */}
        <SectionReveal className="w-full flex justify-center text-center">
          <GradientHeader
            align="center"
            badge={
              <>
                <Users className="w-5 h-5" />
                <span>About Job Jockey</span>
              </>
            }
            title="Build Your Team with Job-Ready Talent"
            subtitle=""
          />
        </SectionReveal>

        {/* Centered Content Column */}
        <div className="flex flex-col items-center gap-6 lg:gap-8 group/about w-full mt-2">
          {/* Top Text Description */}
          <SectionReveal className="w-full max-w-5xl flex flex-col justify-center">
            <div className="flex flex-col gap-6 text-lg md:text-xl text-[var(--text-dim)] leading-relaxed text-center">
              <p>
                Job Jockey connects businesses with trained professionals ready to contribute from day one. We support companies with hiring, workforce solutions, and project support while helping professionals access meaningful career opportunities.
              </p>
            </div>
          </SectionReveal>

          {/* Bottom SVG Graphic */}
          <SectionReveal className="w-full max-w-3xl">
            <GlassCard className="relative p-0 overflow-hidden aspect-video flex items-center justify-center border-[var(--primary)]/20 shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-all duration-500 hover:shadow-[0_0_60px_rgba(var(--primary-rgb),0.2)] hover:-translate-y-2 group">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent z-0 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="relative z-10 w-full h-full overflow-hidden rounded-xl bg-[#0F121C]">
                {/* Outer Monitor Frame */}
                <div className="absolute inset-x-8 inset-y-6 rounded-xl border-4 border-[#2A2E3D] bg-[#1A1D27] shadow-2xl overflow-hidden flex flex-col">
                  {/* Monitor Screen Top Bar */}
                  <div className="h-4 bg-[#212531] border-b border-[#2A2E3D] flex items-center px-4 gap-1.5 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                    <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                    <div className="w-2 h-2 rounded-full bg-[#27C93F]" />
                  </div>

                  {/* Split Screen Content */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* Left Panel: Code/Team Setup */}
                    <div className="flex-1 border-r border-[#2A2E3D] p-4 relative overflow-hidden bg-[#161922]">
                      {/* Glowing connection lines */}
                      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M 12 20 C 30 20, 30 30, 50 30" stroke="var(--primary)" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none" className="drop-shadow-[0_0_5px_var(--primary)]" />
                        <path d="M 88 20 C 70 20, 70 30, 50 30" stroke="#38BDF8" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none" className="drop-shadow-[0_0_5px_#38BDF8]" />
                        <path d="M 50 75 C 40 55, 60 45, 50 30" stroke="#A78BFA" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none" className="drop-shadow-[0_0_5px_#A78BFA]" />
                      </svg>

                      {/* Floating Nodes */}
                      <div className="absolute top-10 w-full flex justify-between px-6 z-10">
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-[#2A2E3D] border border-white/10 flex items-center justify-center p-2 shadow-lg backdrop-blur-md">
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-full h-full opacity-80"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                          </div>
                          <span className="text-[8px] text-white/50 font-mono">Dev</span>
                        </motion.div>

                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5, delay: 1 }} className="flex flex-col items-center gap-2 mt-6">
                          <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 border border-[var(--primary)]/50 flex items-center justify-center p-2.5 shadow-[0_0_15px_var(--primary-rgb)] backdrop-blur-md">
                            <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" className="w-full h-full drop-shadow-[0_0_3px_var(--primary)]"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                          </div>
                          <span className="text-[10px] text-[var(--primary)] font-bold tracking-wider">TALENT</span>
                        </motion.div>

                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4.5, delay: 0.5 }} className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-[#2A2E3D] border border-[#38BDF8]/30 flex items-center justify-center p-2.5 shadow-[0_0_10px_rgba(56,189,248,0.3)] backdrop-blur-md">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" className="w-full h-full opacity-90"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          </div>
                          <span className="text-[8px] text-[#38BDF8] font-mono">Product</span>
                        </motion.div>
                      </div>

                      {/* Terminal Window */}
                      <div className="absolute bottom-6 left-6 right-6 bg-black/60 rounded-lg border border-white/5 p-4 font-mono text-[10px] leading-relaxed shadow-lg backdrop-blur-sm z-20">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                          <span className="ml-1 text-white/30 text-[9px]">bash</span>
                        </div>
                        <div className="flex gap-2 items-center mb-1">
                          <span className="text-green-400">➜</span>
                          <span className="text-blue-400">~/job-jockey</span>
                          <span className="text-white">npm run build-team</span>
                        </div>
                        <div className="text-white/70 flex flex-col gap-1.5 mt-1.5">
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0 }} className="flex items-center gap-2"><span className="text-[var(--primary)] text-[8px]">●</span> Sourcing talent...</motion.div>
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0 }} className="flex items-center gap-2"><span className="text-[var(--primary)] text-[8px]">●</span> Validating skills [100%]</motion.div>
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 0 }} className="text-green-400 font-bold mt-1">✓ Team successfully deployed</motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel: AI Talent Matcher */}
                    <div className="flex-1 p-4 bg-[#1A1D27] flex flex-col gap-3 relative">
                      {/* Header */}
                      <div className="flex justify-between items-center bg-[#2A2E3D]/50 p-2 rounded-lg border border-white/5">
                        <div className="text-[10px] text-white/70 font-semibold flex items-center gap-2">
                          <Zap className="w-3 h-3 text-[var(--primary)]" /> Talent Matcher AI
                        </div>
                        <div className="text-[8px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold border border-green-500/30">98% Match</div>
                      </div>

                      {/* Candidate Profile Preview */}
                      <div className="bg-[#212531] rounded-lg p-3 border border-white/5 shadow-inner">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[#38BDF8] flex items-center justify-center p-0.5">
                            <div className="w-full h-full rounded-full bg-[#1A1D27] flex items-center justify-center overflow-hidden">
                              <Users className="w-5 h-5 text-white/80" />
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-white">Sarah Jenkins</div>
                            <div className="text-[9px] text-white/50">Senior Full-Stack Engineer</div>
                          </div>
                        </div>

                        {/* Skills Tags */}
                        <div className="flex flex-wrap gap-1">
                          {["React", "Node.js", "AWS", "Python"].map((skill) => (
                            <span key={skill} className="text-[7px] bg-[#2A2E3D] text-white/70 px-1.5 py-0.5 rounded border border-white/5">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Match Analysis Feed */}
                      <div className="flex-1 bg-[#212531] rounded-lg border border-white/5 p-3 flex flex-col gap-3 shadow-inner overflow-hidden">
                        <div className="text-[9px] text-white/50 uppercase tracking-widest font-bold">AI Analysis Metrics</div>

                        <div className="flex flex-col gap-3">
                          {[
                            { label: "Technical Proficiency", value: "94%", color: "bg-[var(--primary)]" },
                            { label: "Experience Match", value: "91%", color: "bg-blue-400" },
                            { label: "Cultural Alignment", value: "88%", color: "bg-purple-400" }
                          ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-center text-[8px] text-white/80 font-medium">
                                <span className="opacity-60">{item.label}</span>
                                <span className="font-bold text-[var(--primary)]">{item.value}</span>
                              </div>
                              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: item.value }}
                                  transition={{ duration: 1.2, delay: 0.3 + (i * 0.1) }}
                                  className={`h-full ${item.color} shadow-[0_0_8px_rgba(255,255,255,0.2)]`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-auto border-t border-white/5 pt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[8px] text-green-400 font-mono">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            AI_MATCH_VERIFIED
                          </div>
                          <div className="text-[7px] text-white/30 font-mono italic">LATENCY: 14ms</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Laptop Base */}
                <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[85%] h-5 bg-gradient-to-b from-[#3A3F50] to-[#1E212B] rounded-b-2xl flex justify-center shadow-2xl z-30 border-t border-white/10">
                  <div className="w-1/4 h-1 bg-[#1A1D27] rounded-b-md mx-auto relative shadow-inner">
                    {/* Power Indicator */}
                    <div className="absolute right-[-10px] top-[1px] w-0.5 h-0.5 rounded-full bg-white shadow-[0_0_2px_#fff]" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </SectionReveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container mx-auto px-6">
        <SectionReveal className="text-center">
          <GradientHeader
            title="Our Services"
            subtitle="Tailored solutions for both businesses and talent."
          />
          <p className="text-m font-semibold text-[var(--text-main)] mt-2 uppercase tracking-wide">
            Domains We Support:
          </p>
          <p className="text-sm font-medium uppercase tracking-wider mt-3 text-center">
            <span className="text-[#111827] dark:text-[var(--primary)] font-bold">IT • Marketing • Sales • Operations • Finance • Customer Support • Business Development • Data & Analytics • AI/ML</span>
          </p>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 items-start">
          {/* For Businesses Carousel */}
          <div>
            <SectionReveal className="text-center mb-2">
              <h3 className="text-2xl font-display font-bold text-[var(--text-main)]">For Businesses</h3>
            </SectionReveal>
            <SectionReveal stagger delay={0.1} className="relative min-h-[320px]">
              <ServiceCarousel 
                services={[
                  {
                    icon: Settings,
                    title: "Contingent Workforce",
                    desc: "Access professionals deployed through Job Jockey who work with your team while we handle payroll, compliance, and workforce management.",
                    meta: "Best For: Flexible workforce needs, Project-based support, Scaling teams quickly",
                  },
                  {
                    icon: Briefcase,
                    title: "Permanent Hiring",
                    desc: "Companies can hire candidates directly from the Job Jockey talent network for full-time roles within their organization.",
                    meta: "What we do: Source candidates, Screen profiles, Shortlist talent, Companies hire them directly",
                  },
                  {
                    icon: Users,
                    title: "Managed Teams",
                    desc: "We build and manage dedicated teams that support your business operations while you focus on growth.",
                    meta: "Examples: Customer support teams, Operations teams, Research teams",
                  },
                  {
                    icon: Zap,
                    title: "Project Execution",
                    desc: "Businesses can outsource specific projects to Job Jockey where our team handles execution from start to finish.",
                    meta: "Examples: Lead generation, Data research, Market analysis, Operational support",
                  },
                  {
                    icon: Globe,
                    title: "Talent Network Access",
                    desc: "Gain access to a growing network of professionals across multiple domains allowing companies to quickly identify the right talent.",
                    meta: "Global Network",
                  },
                  {
                    icon: GraduationCap,
                    title: "Early Career Talent Program",
                    desc: "Access trained early-career professionals ready to contribute to business operations while building industry experience.",
                    meta: "Next Gen Talent",
                  }
                ]} 
              />
            </SectionReveal>
          </div>

          {/* For Candidates Carousel */}
          <div>
            <SectionReveal className="text-center mb-2">
              <h3 className="text-2xl font-display font-bold text-[var(--text-main)]">For Talent</h3>
            </SectionReveal>
            <SectionReveal stagger delay={0.2} className="relative min-h-[320px]">
              <ServiceCarousel 
                services={[
                  {
                    icon: Laptop,
                    title: "Remote Jobs",
                    desc: "Find high-quality remote roles at top-tier companies worldwide and work from anywhere.",
                    meta: "Global roles, Work-life balance, Top pay",
                  },
                  {
                    icon: Briefcase,
                    title: "Internships",
                    desc: "Gain real-world experience through specialized internships designed to jumpstart your professional journey.",
                    meta: "Mentorship, Hands-on projects, Fast-track to full-time",
                  },
                  {
                    icon: GraduationCap,
                    title: "Training & Upskilling",
                    desc: "Access industry-recognized training programs to master the skills demanded by modern employers.",
                    meta: "Verified certifications, Expert-led, Practical curriculum",
                  }
                ]} 
              />
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container mx-auto px-6 overflow-hidden" id="how-it-works">
        <SectionReveal className="text-center mb-16">
          <GradientHeader
            title="How It Works"
            subtitle="A seamless process from start to finish."
          />
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* For Companies */}
          <SectionReveal className="flex flex-col items-center">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-display font-bold text-[var(--text-main)]">For Companies</h3>
            </div>
            
            <div className="w-full relative min-h-[500px] flex items-center justify-center scale-90 md:scale-100">
             <RadialOrbitalTimeline 
                timelineData={[
                  {
                    id: 1,
                    title: "Businesses Share Requirements",
                    date: "Step 1",
                    content: "Companies tell us the roles and workforce requirements.",
                    category: "Company",
                    icon: Briefcase,
                  },
                  {
                    id: 2,
                    title: "Talent Selection",
                    date: "Step 2",
                    content: "Our team identifies and prepares suitable professionals from our talent network.",
                    category: "Company",
                    icon: Users,
                  },
                  {
                    id: 3,
                    title: "Workforce Deployment",
                    date: "Step 3",
                    content: "Selected professionals begin supporting the business operations.",
                    category: "Company",
                    icon: CheckCircle,
                  },
                  {
                    id: 4,
                    title: "Ongoing Management",
                    date: "Step 4",
                    content: "Job Jockey manages payroll, compliance, and workforce coordination.",
                    category: "Company",
                    icon: Settings,
                  }
                ]} 
              />
            </div>
          </SectionReveal>

          {/* For Candidates */}
          <SectionReveal className="flex flex-col items-center">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-display font-bold text-[var(--text-main)]">For Candidates</h3>
            </div>
            
            <div className="w-full relative min-h-[500px] flex items-center justify-center scale-90 md:scale-100">
             <RadialOrbitalTimeline 
                timelineData={[
                  {
                    id: 5,
                    title: "Apply Now",
                    date: "Step 1",
                    content: "Browse and apply for high-quality jobs or internships matching your skills.",
                    category: "Candidate",
                    icon: Laptop,
                  },
                  {
                    id: 6,
                    title: "Skill Assessment",
                    date: "Step 2",
                    content: "Complete our comprehensive skill assessment to validate your expertise.",
                    category: "Candidate",
                    icon: FileText,
                  },
                  {
                    id: 7,
                    title: "Real-world Training",
                    date: "Step 3",
                    content: "Get hands-on training based on real company workflows and projects.",
                    category: "Candidate",
                    icon: Zap,
                  },
                  {
                    id: 8,
                    title: "Direct Placement",
                    date: "Step 4",
                    content: "Get placed in top-tier internships or full-time roles with our partners.",
                    category: "Candidate",
                    icon: Briefcase,
                  }
                ]} 
              />
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="container mx-auto px-6 relative my-20" id="why-choose-us">
        <SectionReveal className="text-center mb-16">
          <GradientHeader
            title="Why Businesses & Professionals Choose Job Jockey"
            subtitle="Delivering value to our users every day."
          />
        </SectionReveal>

        <div className="max-w-6xl mx-auto">
          <SectionReveal stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlassCard className="p-8 flex flex-col gap-4 border border-black/5 dark:border-[var(--primary)]/10 hover:border-[var(--primary)]/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-[var(--primary)]/10 flex items-center justify-center text-[#111827] dark:text-[var(--primary)] group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[var(--text-main)]">Industry-ready talent</h4>
              <p className="text-[var(--text-dim)] leading-relaxed text-sm">
                Candidates trained and prepared based on real business requirements.
              </p>
            </GlassCard>

            <GlassCard className="p-8 flex flex-col gap-4 border border-black/5 dark:border-[var(--primary)]/10 hover:border-[var(--primary)]/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-[var(--primary)]/10 flex items-center justify-center text-[#111827] dark:text-[var(--primary)] group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[var(--text-main)]">Access to diverse skill sets</h4>
              <p className="text-[var(--text-dim)] leading-relaxed text-sm">
                Find professionals across marketing, technology, operations, sales, and more.
              </p>
            </GlassCard>

            <GlassCard className="p-8 flex flex-col gap-4 border border-black/5 dark:border-[var(--primary)]/10 hover:border-[var(--primary)]/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-[var(--primary)]/10 flex items-center justify-center text-[#111827] dark:text-[var(--primary)] group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[var(--text-main)]">Faster hiring process</h4>
              <p className="text-[var(--text-dim)] leading-relaxed text-sm">
                We help companies identify and connect with suitable candidates quickly.
              </p>
            </GlassCard>

            <GlassCard className="p-8 flex flex-col gap-4 border border-black/5 dark:border-[var(--primary)]/10 hover:border-[var(--primary)]/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-[var(--primary)]/10 flex items-center justify-center text-[#111827] dark:text-[var(--primary)] group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[var(--text-main)]">Flexible workforce solutions</h4>
              <p className="text-[var(--text-dim)] leading-relaxed text-sm">
                Businesses can hire directly, build teams, or work with our managed workforce.
              </p>
            </GlassCard>

            <GlassCard className="p-8 flex flex-col gap-4 border border-black/5 dark:border-[var(--primary)]/10 hover:border-[var(--primary)]/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-[var(--primary)]/10 flex items-center justify-center text-[#111827] dark:text-[var(--primary)] group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[var(--text-main)]">Career opportunities for professionals</h4>
              <p className="text-[var(--text-dim)] leading-relaxed text-sm">
                Candidates get access to opportunities with growing companies across industries.
              </p>
            </GlassCard>
            
          </SectionReveal>
        </div>
      </section>

      {/* CHOOSE YOUR PATH */}
      <section className="container mx-auto px-6 relative my-12" id="paths">
        <SectionReveal className="text-center">
          <GradientHeader
            title="Choose Your Path"
            subtitle="Are you looking to hire or getting hired?"
          />
        </SectionReveal>

        <div className="max-w-4xl mx-auto mt-16 relative">
          <SectionReveal stagger className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/business/enquiry" className="block h-full cursor-pointer relative z-10">
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="h-full">
                <GlassCard className="h-full p-10 flex flex-col items-center text-center gap-6 border border-black/5 dark:border-[var(--primary)]/20 hover:border-[var(--primary)]/60 hover:shadow-[0_10px_40px_rgba(var(--primary-rgb),0.2)] transition-all group">
                  <div className="w-20 h-20 rounded-2xl bg-black/5 dark:bg-[var(--primary)]/10 flex items-center justify-center text-[#111827] dark:text-[var(--primary)] mb-2 group-hover:rotate-6 transition-transform relative">
                    <Building2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">For Businesses</h4>
                  <p className="text-[var(--text-dim)] leading-relaxed text-lg">
                    Find and hire job-ready talent, post jobs, and build high-performance teams efficiently.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-4 rounded-full px-8 py-3 bg-[#111827] dark:bg-white text-white dark:text-black font-bold text-lg w-full transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_var(--primary-glow)]"
                  >
                    Business Enquiry <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
                  </motion.button>
                </GlassCard>
              </motion.div>
            </Link>

            <Link href="/talent/create-profile" className="block h-full cursor-pointer relative z-10">
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="h-full">
                <GlassCard className="h-full p-10 flex flex-col items-center text-center gap-6 border border-black/5 dark:border-[var(--primary)]/20 hover:border-[var(--primary)]/60 hover:shadow-[0_10px_40px_rgba(var(--primary-rgb),0.2)] transition-all group">
                  <div className="w-20 h-20 rounded-2xl bg-black/5 dark:bg-[var(--primary)]/10 flex items-center justify-center text-[#111827] dark:text-[var(--primary)] mb-2 group-hover:-rotate-6 transition-transform relative">
                    <Briefcase className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">For Talent</h4>
                  <p className="text-[var(--text-dim)] leading-relaxed text-lg">
                    Create your profile, discover new job opportunities, and accelerate your career growth.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-4 rounded-full px-8 py-3 bg-[#111827] dark:bg-white text-white dark:text-black font-bold text-lg w-full transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_var(--primary-glow)]"
                  >
                    Create Profile <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
                  </motion.button>
                </GlassCard>
              </motion.div>
            </Link>
          </SectionReveal>
        </div>
      </section>


    </div>
  );
}
