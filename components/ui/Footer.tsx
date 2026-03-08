"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Linkedin } from "lucide-react";
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
                            <Link href="https://x.com/navneet_ac55349" target="_blank" className="hover:text-[var(--primary)] transition-colors">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                            </Link>
                            <Link href="https://www.reddit.com/r/JobJockey/" target="_blank" className="hover:text-[var(--primary)] transition-colors">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.056 1.597.04.21.06.427.06.646 0 2.734-3.516 4.952-7.84 4.952-4.323 0-7.84-2.218-7.84-4.952 0-.22.021-.435.062-.646A1.757 1.757 0 0 1 3.514 11.75c0-.968.786-1.754 1.754-1.754.463 0 .882.18 1.189.479 1.18-.846 2.813-1.4 4.615-1.484l.956-4.488a.5.5 0 0 1 .595-.385l3.38.712c.197-.391.606-.646 1.057-.646zm-6.39 7.13c-.603 0-1.092.49-1.092 1.09s.49 1.093 1.091 1.093c.603 0 1.092-.49 1.092-1.093s-.49-1.091-1.092-1.091zm4.76 0c-.603 0-1.091.49-1.091 1.09s.488 1.093 1.091 1.093c.603 0 1.092-.49 1.092-1.093s-.489-1.091-1.092-1.091zm-4.76 3.974a.387.387 0 0 0-.287.654c.9.9 2.184 1.242 3.393 1.242 1.209 0 2.492-.341 3.393-1.242a.387.387 0 1 0-.547-.547c-.723.723-1.816 1.03-2.846 1.03-1.03 0-2.124-.307-2.847-1.03a.387.387 0 0 0-.259-.107z"></path></svg>
                            </Link>
                            <Link href="https://www.linkedin.com/company/111772347" target="_blank" className="hover:text-[var(--primary)] transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <h4 className="text-white font-display font-semibold tracking-wide text-lg">Platform</h4>
                        <nav className="flex flex-col gap-3">
                            <Link href="/jobs" className="text-sm text-white/60 hover:text-[var(--primary)] transition-all">Jobs</Link>
                            <Link href="/internships" className="text-sm text-white/60 hover:text-[var(--primary)] transition-all">Internships</Link>
                            <Link href="/business/enquiry" className="text-sm text-white/60 hover:text-[var(--primary)] transition-all">For Businesses</Link>
                            <Link href="/talent/create-profile" className="text-sm text-white/60 hover:text-[var(--primary)] transition-all">For Talent</Link>
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
                                <div className="flex flex-col gap-1">
                                    <a href="mailto:careers@jobjockey.in" className="hover:text-[var(--primary)]">careers@jobjockey.in</a>
                                    <a href="mailto:info@jobjockey.in" className="hover:text-[var(--primary)]">info@jobjockey.in</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-[var(--primary)] shrink-0" />
                                <div className="flex flex-col gap-1">
                                    <a href="tel:+919970122357" className="hover:text-[var(--primary)]">+91-9970122357</a>
                                    <a href="tel:+918799458253" className="hover:text-[var(--primary)]">+91-8799458253</a>
                                </div>
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
