"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, X, ChevronDown } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";

const navItems = [
    { name: "HOME", href: "/" },
    { name: "JOBS", href: "/jobs" },
    { name: "INTERNSHIPS", href: "/internships" },
    {
        name: "SOLUTIONS",
        dropdown: [
            {
                name: "For Businesses",
                description: "Looking to hire trained candidates?",
                href: "/business/enquiry",
            },
            {
                name: "For Talent",
                description: "Didn't find a suitable job? Submit your resume to our talent network",
                href: "/talent/create-profile",
            },
        ],
    },
];

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [mobileSolutionsOpen, setMobileSolutionsOpen] = React.useState(false);
    const pathname = usePathname();
    const { user } = useUser();

    const role = user?.publicMetadata?.role as string | undefined;
    let dashboardHref = "";
    let dashboardText = "";

    if (role === "admin") {
        dashboardHref = "/admin";
        dashboardText = "Admin Panel";
    } else if (role === "company") {
        dashboardHref = "/business/dashboard";
        dashboardText = "Employer Portal";
    } else if (role === "talent") {
        dashboardHref = "/talent/dashboard";
        dashboardText = "Dashboard";
    }

    const visibleNavItems = navItems.filter((item) => {
        if (item.name === "SOLUTIONS" && (role === "company" || role === "talent")) {
            return false;
        }
        return true;
    });

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
                    {visibleNavItems.map((item, idx) => {
                        const isActive = item.href ? pathname === item.href : item.dropdown?.some(link => pathname === link.href);
                        return (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                {item.dropdown ? (
                                    <div className="relative group/dropdown py-4"> {/* Added padding for hover area */}
                                        <button
                                            className={`flex items-center gap-1 transition-colors ${
                                                isActive ? "text-[var(--primary)]" : "text-white/70 hover:text-[var(--primary)]"
                                            }`}
                                        >
                                            <span className="text-sm font-medium">{item.name}</span>
                                            <ChevronDown className="h-4 w-4 transition-transform group-hover/dropdown:rotate-180" />
                                        </button>
                                        
                                        <div className="absolute top-[80%] -left-2 mt-2 w-72 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 transform translate-y-2 group-hover/dropdown:translate-y-0">
                                            <div className="bg-[#0A0A0A]/95 border border-white/10 rounded-xl shadow-xl overflow-hidden backdrop-blur-xl p-2 flex flex-col gap-1">
                                                {item.dropdown.map((dropItem) => (
                                                    <Link 
                                                        key={dropItem.name} 
                                                        href={dropItem.href}
                                                        className="flex flex-col gap-1 p-3 rounded-lg hover:bg-white/5 transition-colors group/item"
                                                    >
                                                        <span className="text-sm font-medium text-white group-hover/item:text-[var(--primary)] transition-colors">{dropItem.name}</span>
                                                        <span className="text-xs text-white/50">{dropItem.description}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-nav"
                                                className="absolute bottom-2 left-0 right-0 h-[2px] bg-[var(--primary)]"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href!}
                                        className={`relative flex flex-col transition-colors group py-4 ${
                                            isActive ? "text-[var(--primary)]" : "text-white/70 hover:text-[var(--primary)]"
                                        }`}
                                    >
                                        <span className="text-sm font-medium">{item.name}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-nav"
                                                className="absolute bottom-2 left-0 right-0 h-[2px] bg-[var(--primary)]"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}
                                    </Link>
                                )}
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
                            {dashboardHref && (
                                <Link href={dashboardHref} className="text-sm font-medium text-white/70 hover:text-[var(--primary)] transition-colors">
                                    {dashboardText}
                                </Link>
                            )}
                            <NotificationBell />
                            <ThemeToggle />
                            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-9 h-9 border border-white/20" } }} />
                        </div>
                    </SignedIn>
                </div>

                <div className="flex items-center gap-4 md:hidden z-50">
                    <SignedIn>
                        <NotificationBell />
                    </SignedIn>
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
                        className="md:hidden fixed inset-0 top-20 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/5 flex flex-col items-center justify-start pt-12 pb-24 gap-8 overflow-y-auto"
                    >
                        {visibleNavItems.map((item) => {
                            const isActive = item.href ? pathname === item.href : item.dropdown?.some(link => pathname === link.href);
                            return (
                            <div key={item.name} className="flex flex-col items-center w-full">
                                {item.dropdown ? (
                                    <div className="flex flex-col items-center w-full">
                                        <button 
                                            onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                                            className={`flex items-center gap-2 text-2xl font-display font-semibold transition-colors ${
                                                isActive ? "text-[var(--primary)]" : "text-white/80 hover:text-[var(--primary)]"
                                            }`}
                                        >
                                            {item.name}
                                            <ChevronDown className={`h-6 w-6 transition-transform ${mobileSolutionsOpen ? "rotate-180" : ""}`} />
                                        </button>
                                        
                                        <AnimatePresence>
                                            {mobileSolutionsOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="flex flex-col items-center gap-6 mt-6 w-full overflow-hidden"
                                                >
                                                    {item.dropdown.map((dropItem) => (
                                                        <Link
                                                            key={dropItem.name}
                                                            href={dropItem.href}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                            className="flex flex-col items-center text-center transition-colors hover:text-[var(--primary)]"
                                                        >
                                                            <span className="text-xl font-medium text-white/90">{dropItem.name}</span>
                                                            <span className="text-sm text-white/50 max-w-[250px] mt-1">{dropItem.description}</span>
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href!}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex flex-col items-center text-center transition-colors group ${
                                            isActive ? "text-[var(--primary)]" : "text-white/80 hover:text-[var(--primary)]"
                                        }`}
                                    >
                                        <span className="text-2xl font-display font-semibold">{item.name}</span>
                                    </Link>
                                )}
                            </div>
                        )})}

                        <div className="mt-8 flex flex-col items-center gap-6 w-full max-w-xs">
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
                                {dashboardHref && (
                                    <Link href={dashboardHref} onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-white/80 hover:text-[var(--primary)]">
                                        {dashboardText}
                                    </Link>
                                )}
                                <div className="mt-4 scale-125">
                                    <UserButton afterSignOutUrl="/" />
                                </div>
                            </SignedIn>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
