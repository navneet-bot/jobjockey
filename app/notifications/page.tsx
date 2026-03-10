import NotificationList from "@/components/features/notifications/NotificationList";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export default function NotificationsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#0A0A0A]">
            <Header />
            <main className="flex-1 container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col gap-2 mb-8">
                        <h1 className="text-4xl font-bold font-display text-white tracking-tight">Your Notifications</h1>
                        <p className="text-white/40 max-w-lg">Stay updated on your platform activities, applications, and account status.</p>
                    </div>
                    <NotificationList />
                </div>
            </main>
            <Footer />
        </div>
    );
}
