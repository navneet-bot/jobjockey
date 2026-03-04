import { CompanySidebar } from "@/components/features/company/CompanySidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companiesTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "JobJockey - Employer Portal",
};

export default async function CompanyLayout({ children }: { children: React.ReactNode }) {
    const user = await currentUser();
    if (!user) redirect("/");

    const role = user.publicMetadata?.role as string | undefined;

    if (role !== "company" && role !== "admin") {
        redirect("/");
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 w-full flex pt-10 px-4 md:px-8 max-w-[1400px] mx-auto gap-8 pb-20">
                <CompanySidebar />

                {/* Company Content Area */}
                <section className="flex-1 w-full animate-in fade-in zoom-in-95 duration-500">
                    {children}
                </section>
            </main>
        </div>
    );
}
