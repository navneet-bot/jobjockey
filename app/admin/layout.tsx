import { AdminSidebar } from "@/components/features/admin/AdminSidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {

    metadataBase: new URL("https://jobjockey.in"),

    title: {
        default: "JobJockey - Find Jobs & Hire Talent",
        template: "%s | JobJockey"
    },

    description:
        "JobJockey connects companies with skilled candidates. Find jobs, internships, and hire top talent easily.",

    keywords: [
        "jobs",
        "internships",
        "hire talent",
        "job portal",
        "IT jobs India",
        "freshers jobs",
        "student internships"
    ],

    authors: [{ name: "JobJockey" }],

    openGraph: {

        title: "JobJockey",

        description:
            "Find jobs and internships or hire top talent.",

        url: "https://jobjockey.in",

        siteName: "JobJockey",

        images: [

            {
                url: "/og-image.png",
                width: 1200,
                height: 630
            }

        ],

        locale: "en_US",

        type: "website"

    },

    robots: {

        index: true,

        follow: true,

        googleBot: {

            index: true,

            follow: true,

            "max-video-preview": -1,

            "max-image-preview": "large",

            "max-snippet": -1

        }

    }

};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    let user;
    try {
        user = await currentUser();
    } catch (e) {
        console.error("Clerk auth failed:", e);
        return (
            <div className="p-10 text-center">
                <h1 className="text-xl font-bold text-destructive">Authentication Error</h1>
                <p className="text-muted-foreground mt-2">Failed to reach authentication server. Please check your internet connection.</p>
            </div>
        );
    }

    if (!user || user?.publicMetadata?.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 w-full flex pt-10 px-4 md:px-8 max-w-[1600px] mx-auto gap-8 pb-20">
                <AdminSidebar />

                {/* Admin Content Area */}
                <section className="flex-1 w-full min-w-0 animate-in fade-in zoom-in-95 duration-500">
                    {children}
                </section>
            </main>
        </div>
    );
}
