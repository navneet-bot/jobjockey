"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, X, Check, ExternalLink, Clock } from "lucide-react";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "@/actions/notificationActions";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "./button";

export function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    async function loadNotifications() {
        setLoading(true);
        const data = await getNotifications(10);
        setNotifications(data);
        const count = await getUnreadCount();
        setUnreadCount(count);
        setLoading(false);
    }

    useEffect(() => {
        loadNotifications();
        
        // Polling for new notifications every 30 seconds
        const interval = setInterval(() => {
            loadNotifications();
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleMarkAsRead(id: string) {
        const res = await markAsRead(id);
        if (res.success) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    }

    async function handleMarkAllAsRead() {
        const res = await markAllAsRead();
        if (res.success) {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-white/5 transition-colors text-white/70 hover:text-[var(--primary)]"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0A0A0A]">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-4 w-96 max-w-[90vw] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[60] backdrop-blur-xl"
                    >
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <h3 className="font-bold text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs font-medium text-[var(--primary)] hover:underline"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto hide-scrollbar">
                            {loading && notifications.length === 0 ? (
                                <div className="p-8 text-center text-white/50 animate-pulse">
                                    Loading...
                                </div>
                            ) : notifications.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {notifications.map((notif) => (
                                        <div 
                                            key={notif.id}
                                            className={`p-4 transition-colors hover:bg-white/5 relative group ${!notif.isRead ? "bg-white/[0.02]" : ""}`}
                                        >
                                            {!notif.isRead && (
                                                <div className="absolute top-4 right-4 w-2 h-2 bg-[var(--primary)] rounded-full shadow-[0_0_8px_var(--primary-glow)]" />
                                            )}
                                            
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <span className={`font-semibold text-sm ${!notif.isRead ? "text-white" : "text-white/70"}`}>
                                                        {notif.title}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-white/50 leading-relaxed">
                                                    {notif.message}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-[10px] text-white/30 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDistanceToNow(new Date(notif.createdAt))} ago
                                                    </span>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        {!notif.isRead && (
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleMarkAsRead(notif.id);
                                                                }}
                                                                className="p-1 px-2 rounded-full bg-white/5 hover:bg-white/10 text-[10px] text-white/60 hover:text-white transition-all flex items-center gap-1"
                                                            >
                                                                <Check className="w-3 h-3" /> Mark read
                                                            </button>
                                                        )}
                                                        {notif.link && (
                                                            <Link 
                                                                href={notif.link}
                                                                onClick={() => {
                                                                    setIsOpen(false);
                                                                    handleMarkAsRead(notif.id);
                                                                }}
                                                                className="p-1 px-2 rounded-full bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[10px] text-[var(--primary)] transition-all flex items-center gap-1"
                                                            >
                                                                <ExternalLink className="w-3 h-3" /> View
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-white/30 flex flex-col items-center gap-3">
                                    <Bell className="w-8 h-8 opacity-20" />
                                    <p className="text-sm">All caught up!</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-3 border-t border-white/5 text-center">
                            <Link 
                                href="/notifications" 
                                onClick={() => setIsOpen(false)}
                                className="text-xs font-medium text-white/50 hover:text-white transition-colors"
                            >
                                View all notifications
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
