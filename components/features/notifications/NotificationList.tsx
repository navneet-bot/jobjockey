"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Trash2, ExternalLink, Calendar, Filter } from "lucide-react";
import { getNotifications, markAsRead, markAllAsRead } from "@/actions/notificationActions";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NotificationList() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const [loading, setLoading] = useState(true);

    async function loadNotifications() {
        setLoading(true);
        const data = await getNotifications(50);
        setNotifications(data);
        setLoading(false);
    }

    useEffect(() => {
        loadNotifications();
    }, []);

    const filteredNotifications = notifications.filter(n => {
        if (filter === "unread") return !n.isRead;
        return true;
    });

    async function handleMarkAsRead(id: string) {
        const res = await markAsRead(id);
        if (res.success) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        }
    }

    async function handleMarkAllAsRead() {
        if (notifications.every(n => n.isRead)) return;
        const res = await markAllAsRead();
        if (res.success) {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                        <SelectTrigger className="w-[180px] bg-secondary/50 border-border text-foreground rounded-xl">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                            <SelectItem value="all">All Notifications</SelectItem>
                            <SelectItem value="unread">Unread Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <Button 
                    variant="outline" 
                    onClick={handleMarkAllAsRead}
                    disabled={notifications.every(n => n.isRead)}
                    className="rounded-xl border-border hover:bg-accent text-xs"
                >
                    <Check className="w-4 h-4 mr-2" />
                    Mark all as read
                </Button>
            </div>

            {loading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-secondary/30 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : filteredNotifications.length > 0 ? (
                <div className="flex flex-col gap-3">
                    <AnimatePresence mode="popLayout">
                        {filteredNotifications.map((notif) => (
                            <motion.div
                                key={notif.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <GlassCard className={`p-5 flex items-start gap-4 transition-all border-l-4 ${!notif.isRead ? "border-l-[var(--primary)] bg-secondary/20" : "border-l-transparent bg-transparent"}`}>
                                    <div className={`p-3 rounded-xl ${!notif.isRead ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "bg-secondary text-muted-foreground"}`}>
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h4 className={`font-bold transition-colors ${!notif.isRead ? "text-foreground" : "text-muted-foreground/60"}`}>
                                                {notif.title}
                                            </h4>
                                            <span className="text-[10px] text-muted-foreground/40 whitespace-nowrap flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {format(new Date(notif.createdAt), "MMM d, yyyy • h:mm a")}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                            {notif.message}
                                        </p>
                                        
                                        <div className="flex items-center gap-3">
                                            {notif.link && (
                                                <Link href={notif.link}>
                                                    <Button 
                                                        size="sm" 
                                                        className="rounded-xl bg-[var(--primary)] text-black font-bold h-8"
                                                        onClick={() => handleMarkAsRead(notif.id)}
                                                    >
                                                        <ExternalLink className="w-3 h-3 mr-2" />
                                                        View Details
                                                    </Button>
                                                </Link>
                                            )}
                                            {!notif.isRead && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => handleMarkAsRead(notif.id)}
                                                    className="h-8 text-xs text-muted-foreground hover:text-foreground rounded-xl"
                                                >
                                                    Mark as read
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                    <div className="p-6 rounded-full bg-secondary text-muted-foreground/20">
                        <Bell className="w-12 h-12" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No notifications found</h3>
                        <p className="text-muted-foreground">You're all caught up! Check back later for updates.</p>
                    </div>
                    {filter === "unread" && (
                        <Button variant="link" onClick={() => setFilter("all")} className="text-[var(--primary)]">
                            Show all notifications
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
