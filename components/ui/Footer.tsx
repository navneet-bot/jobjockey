"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin } from "lucide-react";
import { InfoModal } from "./InfoModal";
import { motion } from "framer-motion";
import SectionReveal from "./SectionReveal";

export function Footer() {
    const currentYear = new Date().getFullYear();
    const [openModal, setOpenModal] = React.useState<string | null>(null);

    const closeModal = () => setOpenModal(null);

    const modalContent: Record<string, { title: string; content: React.ReactNode }> = {
        about: {
            title: "About Job Jockey",
            content: (
                <div className="space-y-4">
                    <p>
                        Job Jockey is a remote-first training and hiring partner focused on building job-ready talent for modern companies.
                        We work closely with businesses to understand their hiring needs and required skill sets. Based on those requirements, we train students and freshers in real-world tools, technologies, and workflows. Our goal is to bridge the gap between education and industry.
                    </p>
                    <p>
                        We don’t just help candidates find jobs, We prepare them to perform from day one.
                    </p>
                    <div>
                        <p className="font-semibold mb-2">Our Services:</p>
                        <ul className="list-disc pl-6 space-y-1 text-foreground/70">
                            <li>Hiring support for companies</li>
                            <li>Industry-aligned training programs</li>
                            <li>Remote job and internship opportunities</li>
                            <li>Workforce support solutions</li>
                        </ul>
                    </div>
                </div>
            )
        },
        careers: {
            title: "Careers at Job Jockey",
            content: (
                <div className="space-y-4">
                    <p>
                        We are building a team that believes in growth, learning, and innovation. At Job Jockey, we value:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-foreground/70">
                        <li>Responsibility</li>
                        <li>Clear communication</li>
                        <li>Continuous learning</li>
                        <li>Results-driven mindset</li>
                    </ul>
                </div>
            )
        },
        privacy: {
            title: "Privacy Policy",
            content: (
                <div className="space-y-4">
                    <p>
                        At Job Jockey, we respect your privacy and are committed to protecting your personal information.
                    </p>
                </div>
            )
        },
        terms: {
            title: "Terms of Service",
            content: (
                <div className="space-y-4">
                    <p>
                        By using our website and services, you agree to the following terms.
                    </p>
                </div>
            )
        }
    };

    return (
        <footer className="w-full bg-[#0A0A0A] border-t border-[rgba(255,255,255,0.05)] pt-16 pb-8 mt-20 relative z-50 overflow-hidden rounded-t-[32px]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-30" />
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--primary)]/5 blur-[120px] rounded-full pointer-events-none" />

            <SectionReveal className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Brand */}
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="font-display font-bold text-2xl tracking-tight text-white">
                                JOB <span className="text-[var(--primary)]">JOCKEY</span>
                            </span>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                            Job Jockey helps companies hire trained candidates. We also help students and freshers learn practical skills and get remote jobs or internships.
                        </p>
                        <div className="flex items-center gap-4 text-white/40 mt-2">
                            <Link href="#" className="hover:text-[var(--primary)] transition-colors">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="hover:text-[var(--primary)] transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="https://www.linkedin.com/company/111772347" target="_blank" className="hover:text-[var(--primary)] transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-white font-display font-semibold tracking-wide text-lg">Platform</h4>
                        <nav className="flex flex-col gap-3">
                            <Link href="/jobs" className="text-sm text-white/60 hover:text-[var(--primary)] transition-all">Browse Jobs</Link>
                            <Link href="/enquiry" className="text-sm text-white/60 hover:text-[var(--primary)] transition-all">Post a Job</Link>
                        </nav>
                    </div>

                    {/* Column 3: Utility Pages */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-white font-display font-semibold tracking-wide text-lg">Company</h4>
                        <nav className="flex flex-col gap-3">
                            <button onClick={() => setOpenModal('about')} className="text-left text-sm text-white/60 hover:text-[var(--primary)] transition-all cursor-pointer">About Us</button>
                            <button onClick={() => setOpenModal('careers')} className="text-left text-sm text-white/60 hover:text-[var(--primary)] transition-all cursor-pointer">Careers</button>
                            <button onClick={() => setOpenModal('privacy')} className="text-left text-sm text-white/60 hover:text-[var(--primary)] transition-all cursor-pointer">Privacy Policy</button>
                            <button onClick={() => setOpenModal('terms')} className="text-left text-sm text-white/60 hover:text-[var(--primary)] transition-all cursor-pointer">Terms of Service</button>
                        </nav>
                    </div>

                    {/* Column 4: Contact */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-white font-display font-semibold tracking-wide text-lg">Contact Us</h4>
                        <ul className="flex flex-col gap-4 text-sm text-white/60">
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-[var(--primary)] shrink-0" />
                                <a href="mailto:info@jobjockey.in" className="hover:text-[var(--primary)]">info@jobjockey.in</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-[var(--primary)] shrink-0" />
                                <a href="tel:+919970122357" className="hover:text-[var(--primary)]">+91-9970122357</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-[var(--primary)] shrink-0" />
                                <span>Pune, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 text-center">
                    <p className="text-sm text-white/40">
                        &copy; {currentYear} Job Jockey Inc. All rights reserved.
                    </p>
                </div>
            </SectionReveal>

            {/* Info Modals */}
            {Object.entries(modalContent).map(([key, { title, content }]) => (
                <InfoModal
                    key={key}
                    isOpen={openModal === key}
                    onClose={closeModal}
                    title={title}
                >
                    {content}
                </InfoModal>
            ))}
        </footer>
    );
}
