"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Briefcase, PlusCircle, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const companyNav = [
    { text: "Overview", href: "/company", icon: LayoutDashboard },
    { text: "My Jobs", href: "/company/jobs", icon: Briefcase },
    { text: "Post a Job", href: "/company/post-job", icon: PlusCircle },
    { text: "Applications", href: "/company/applications", icon: Users },
];

export function CompanySidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex w-64 shrink-0 flex-col gap-4">
            <GlassCard className="p-4 flex flex-col gap-2">
                <h3 className="font-bold text-lg text-[var(--text-main)] mb-4 px-2">Employer Portal</h3>
                <nav className="flex flex-col gap-1">
                    {companyNav.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/company" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                                    isActive
                                        ? "bg-black/5 dark:bg-white/10 text-[#111827] dark:text-[var(--primary)] border border-black/10 dark:border-white/10 shadow-sm dark:shadow-[0_0_15px_var(--primary-glow)]"
                                        : "text-muted-foreground hover:bg-[var(--glass-border)] hover:text-[#111827] dark:hover:text-white"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.text}
                            </Link>
                        )
                    })}
                </nav>
            </GlassCard>
        </aside>
    );
}
