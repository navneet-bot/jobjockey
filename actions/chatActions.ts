"use server";

import { db } from "@/lib/db";
import { chatConversationsTable, chatMessagesTable, companiesTable } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, desc, count, sql, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getOrCreateConversation(companyId: string) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        // Find existing conversation
        let [conversation] = await db.select()
            .from(chatConversationsTable)
            .where(eq(chatConversationsTable.companyId, companyId))
            .limit(1);

        if (!conversation) {
            // Create new conversation
            [conversation] = await db.insert(chatConversationsTable)
                .values({ companyId })
                .returning();
        }

        if (conversation) {
            // Join with company name
            const [company] = await db.select({ companyName: companiesTable.companyName })
                .from(companiesTable)
                .where(eq(companiesTable.userId, companyId))
                .limit(1);
            
            return { 
                success: true, 
                conversation: {
                    ...conversation,
                    companyName: company?.companyName || "Unknown Company",
                    unreadCount: 0,
                    lastMessage: "No messages yet",
                    lastMessageAt: conversation.createdAt
                } 
            };
        }

        return { success: false, error: "Failed to locate conversation" };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function sendMessage(
    conversationId: string, 
    message: string | null, 
    senderRole: 'admin' | 'employer',
    attachmentUrl?: string,
    attachmentName?: string,
    attachmentType?: string
) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const [newMessage] = await db.insert(chatMessagesTable)
            .values({
                conversationId,
                senderId: userId,
                senderRole,
                message,
                attachmentUrl,
                attachmentName,
                attachmentType,
                isRead: false
            })
            .returning();

        revalidatePath("/admin/chat");
        revalidatePath("/business/chat");

        return { success: true, message: newMessage };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getConversationMessages(conversationId: string, limit: number = 50) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const messages = await db.select()
            .from(chatMessagesTable)
            .where(eq(chatMessagesTable.conversationId, conversationId))
            .orderBy(desc(chatMessagesTable.createdAt))
            .limit(limit);

        return { success: true, messages: messages.reverse() };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function markMessagesAsRead(conversationId: string, role: 'admin' | 'employer') {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    // If I am admin, mark employer messages as read
    // If I am employer, mark admin messages as read
    const targetRole = role === 'admin' ? 'employer' : 'admin';

    try {
        const result = await db.update(chatMessagesTable)
            .set({ isRead: true })
            .where(
                and(
                    eq(chatMessagesTable.conversationId, conversationId),
                    eq(chatMessagesTable.senderRole, targetRole),
                    eq(chatMessagesTable.isRead, false)
                )
            )
            .returning(); // Use returning to check if anything changed

        if (result.length > 0) {
            revalidatePath("/admin/chat");
            revalidatePath("/business/chat");
        }

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getAllConversationsForAdmin() {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        // Get all conversations with company details and unread count
        const conversations = await db.select({
            id: chatConversationsTable.id,
            companyId: chatConversationsTable.companyId,
            companyName: companiesTable.companyName,
            createdAt: chatConversationsTable.createdAt,
        })
        .from(chatConversationsTable)
        .leftJoin(companiesTable, eq(chatConversationsTable.companyId, companiesTable.userId))
        .orderBy(desc(chatConversationsTable.createdAt));

        // Enhancing with unread count and last message
        const enhancedConversations = await Promise.all(conversations.map(async (conv) => {
            const [unreadCountResult] = await db.select({ count: count() })
                .from(chatMessagesTable)
                .where(
                    and(
                        eq(chatMessagesTable.conversationId, conv.id),
                        eq(chatMessagesTable.senderRole, 'employer'),
                        eq(chatMessagesTable.isRead, false)
                    )
                );

            const [lastMessage] = await db.select()
                .from(chatMessagesTable)
                .where(eq(chatMessagesTable.conversationId, conv.id))
                .orderBy(desc(chatMessagesTable.createdAt))
                .limit(1);

            return {
                ...conv,
                unreadCount: Number(unreadCountResult.count),
                lastMessage: lastMessage?.message || (lastMessage?.attachmentUrl ? "Sent an attachment" : "No messages yet"),
                lastMessageAt: lastMessage?.createdAt || conv.createdAt
            };
        }));

        // Sort by last message date
        enhancedConversations.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

        return { success: true, conversations: enhancedConversations };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getAdminUnreadCountTotal() {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const [result] = await db.select({ count: count() })
            .from(chatMessagesTable)
            .where(
                and(
                    eq(chatMessagesTable.senderRole, 'employer'),
                    eq(chatMessagesTable.isRead, false)
                )
            );

        return { success: true, count: Number(result.count) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getEmployerUnreadCount(companyId: string) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const [conversation] = await db.select()
            .from(chatConversationsTable)
            .where(eq(chatConversationsTable.companyId, companyId))
            .limit(1);

        if (!conversation) return { success: true, count: 0 };

        const [result] = await db.select({ count: count() })
            .from(chatMessagesTable)
            .where(
                and(
                    eq(chatMessagesTable.conversationId, conversation.id),
                    eq(chatMessagesTable.senderRole, 'admin'),
                    eq(chatMessagesTable.isRead, false)
                )
            );

        return { success: true, count: Number(result.count) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function searchCompaniesForChat(query: string) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    if (!query || query.length < 2) return { success: true, results: [] };

    try {
        const results = await db.select({
            companyId: companiesTable.userId,
            companyName: companiesTable.companyName,
        })
        .from(companiesTable)
        .where(
            and(
                eq(companiesTable.isVerified, true),
                like(sql`LOWER(${companiesTable.companyName})`, `%${query.toLowerCase()}%`)
            )
        )
        .limit(10);

        return { success: true, results };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
