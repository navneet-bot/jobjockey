"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: "Internships", href: "/internships" },
    { name: "Training", href: "/training" },
    { name: "Enquiry", href: "/enquiry" },
];

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const pathname = usePathname();
    const { user } = useUser();

    const role = user?.publicMetadata?.role as string | undefined;
    let dashboardHref = "/dashboard";
    let dashboardText = "Dashboard";

    if (role === "admin") {
        dashboardHref = "/admin";
        dashboardText = "Admin Panel";
    } else if (role === "company") {
        dashboardHref = "/company";
        dashboardText = "Employer Portal";
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 z-50">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-display font-bold text-2xl tracking-tight text-white"
                    >
                        JOB <span className="text-[var(--primary)]">JOCKEY</span>
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link, idx) => {
                        const isActive = pathname === link.href;
                        return (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link
                                    href={link.href}
                                    className={`relative text-sm font-medium transition-colors hover:text-[var(--primary)] ${isActive ? "text-[var(--primary)]" : "text-white/70"
                                        }`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-nav"
                                            className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[var(--primary)]"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <SignedOut>
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <SignInButton mode="modal">
                                <button className="px-5 py-2 text-sm font-medium text-white/70 hover:text-[var(--primary)] transition-colors">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="px-5 py-2 rounded-full text-sm font-bold bg-[var(--primary)] text-black hover:scale-105 hover:shadow-[0_0_20px_var(--primary-glow)] transition-all">
                                    Get Started
                                </button>
                            </SignUpButton>
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <div className="flex items-center gap-4">
                            <Link href={dashboardHref} className="text-sm font-medium text-white/70 hover:text-[var(--primary)] transition-colors">
                                {dashboardText}
                            </Link>
                            <ThemeToggle />
                            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-9 h-9 border border-white/20" } }} />
                        </div>
                    </SignedIn>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-4 md:hidden z-50">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-white/70 hover:text-white"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                    <div className="md:hidden">
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "100vh" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden fixed inset-0 top-20 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/5 flex flex-col items-center justify-center gap-8 overflow-y-auto"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-2xl font-display font-semibold transition-colors hover:text-[var(--primary)] ${pathname === link.href ? "text-[var(--primary)]" : "text-white/80"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="mt-8 flex flex-col items-center gap-6">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="px-8 py-3 rounded-full text-lg font-medium bg-white/5 border border-white/10 text-white hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all w-full">
                                        Sign In
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="px-8 py-3 rounded-full text-lg font-bold bg-[var(--primary)] text-black hover:scale-105 hover:shadow-[0_0_20px_var(--primary-glow)] transition-all w-full">
                                        Get Started
                                    </button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <Link href={dashboardHref} onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-white/80 hover:text-[var(--primary)]">
                                    {dashboardText}
                                </Link>
                                <div className="mt-4 scale-125">
                                    <UserButton afterSignOutUrl="/" />
                                </div>
                            </SignedIn>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header >
    );
}
