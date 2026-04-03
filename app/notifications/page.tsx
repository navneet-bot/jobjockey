import NotificationList from "@/components/features/notifications/NotificationList";

export default function NotificationsPage() {
    return (
        <div className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-4xl font-bold font-display text-foreground tracking-tight">Your Notifications</h1>
                    <p className="text-muted-foreground max-w-lg">Stay updated on your platform activities, applications, and account status.</p>
                </div>
                <NotificationList />
            </div>
        </div>
    );
}
