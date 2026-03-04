"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Basic navigation layout to sit under the main Navbar if needed, 
    // or just a wrapper for site pages.
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 w-full flex flex-col pt-10">
                <div className="container mx-auto px-4 w-full h-full flex flex-col animate-in fade-in zoom-in-95 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
