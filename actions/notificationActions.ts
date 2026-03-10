"use server";

import { db } from "@/lib/db";
import { notificationsTable, NewNotification } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getNotifications(limit = 10) {
    const { userId } = await auth();
    if (!userId) return [];

    try {
        const notifications = await db.select()
            .from(notificationsTable)
            .where(eq(notificationsTable.userId, userId))
            .orderBy(desc(notificationsTable.createdAt))
            .limit(limit);
        
        return notifications;
    } catch (err) {
        console.error("Fetch notifications error:", err);
        return [];
    }
}

export async function getUnreadCount() {
    const { userId } = await auth();
    if (!userId) return 0;

    try {
        const count = await db.select()
            .from(notificationsTable)
            .where(and(
                eq(notificationsTable.userId, userId),
                eq(notificationsTable.isRead, false)
            ));
        
        return count.length;
    } catch (err) {
        console.error("Fetch unread count error:", err);
        return 0;
    }
}

export async function markAsRead(notificationId: string) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        await db.update(notificationsTable)
            .set({ isRead: true })
            .where(and(
                eq(notificationsTable.id, notificationId),
                eq(notificationsTable.userId, userId)
            ));
        
        revalidatePath("/");
        return { success: true };
    } catch (err) {
        console.error("Mark as read error:", err);
        return { success: false, error: "Failed to update notification" };
    }
}

export async function markAllAsRead() {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        await db.update(notificationsTable)
            .set({ isRead: true })
            .where(eq(notificationsTable.userId, userId));
        
        revalidatePath("/");
        return { success: true };
    } catch (err) {
        console.error("Mark all as read error:", err);
        return { success: false, error: "Failed to update notifications" };
    }
}

// Server-side helper to create notifications (NOT exported for client use normally)
export async function createNotification(data: NewNotification) {
    try {
        await db.insert(notificationsTable).values(data);
        return { success: true };
    } catch (err) {
        console.error("Create notification error:", err);
        return { success: false, error: "Failed to create notification" };
    }
}
