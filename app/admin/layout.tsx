import { AdminSidebar } from "@/components/features/admin/AdminSidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "JobJockey - Admin Dashboard",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await currentUser();
    if (!user || user.publicMetadata?.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 w-full flex pt-10 px-4 md:px-8 max-w-[1400px] mx-auto gap-8 pb-20">
                <AdminSidebar />

                {/* Admin Content Area */}
                <section className="flex-1 w-full animate-in fade-in zoom-in-95 duration-500">
                    {children}
                </section>
            </main>
        </div>
    );
}
