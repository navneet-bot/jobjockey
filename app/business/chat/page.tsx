"use client";

// Bumping file to trigger Turbopack re-parse

import { useState, useEffect, useRef } from "react";
// import { GradientHeader } from "@/components/ui/GradientHeader";
// import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft, Loader2, Paperclip, FileText, Download, X, ExternalLink, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { UploadButton } from "@/lib/uploadthing";
import { 
    getOrCreateConversation, 
    getConversationMessages, 
    sendMessage, 
    markMessagesAsRead 
} from "@/actions/chatActions";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { format } from "date-fns";

export default function BusinessChatPage() {
    const { user, isLoaded } = useUser();
    const [conversation, setConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [attachment, setAttachment] = useState<{ url: string, name: string, type: string } | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            loadConversation();
        }
    }, [isLoaded, user]);

    const loadConversation = async () => {
        const res = await getOrCreateConversation(user!.id);
        if (res.success && res.conversation) {
            setConversation(res.conversation);
            loadMessages(res.conversation.id);
        } else {
            toast.error(res.error || "Failed to load chat");
            setIsLoading(false);
        }
    };

    const loadMessages = async (convId: string) => {
        const res = await getConversationMessages(convId);
        if (res.success && res.messages) {
            setMessages(res.messages);
            await markMessagesAsRead(convId, 'employer');
        }
        setIsLoading(false);
        setTimeout(scrollToBottom, 100);
    };

    // Periodic refresh (polling)
    useEffect(() => {
        if (!conversation) return;

        const interval = setInterval(() => {
            loadMessages(conversation.id);
        }, 5000); // Refresh every 5 seconds

        return () => clearInterval(interval);
    }, [conversation]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newMessage.trim() && !attachment) || !conversation || isSending) return;

        setIsSending(true);
        const res = await sendMessage(
            conversation.id, 
            newMessage.trim() || null, 
            'employer',
            attachment?.url,
            attachment?.name,
            attachment?.type
        );
        if (res.success) {
            setNewMessage("");
            setAttachment(null);
            setMessages([...messages, res.message]);
            setTimeout(scrollToBottom, 50);
        } else {
            toast.error(res.error || "Failed to send message");
        }
        setIsSending(false);
    };

    if (!isLoaded || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 py-12 px-6 w-full max-w-7xl mx-auto h-screen max-h-[1000px]">
            <div className="relative flex items-center justify-center min-h-[80px]">
                <Link href="/business/dashboard" className="absolute left-0">
                    <Button variant="ghost" className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Back to Dashboard</span>
                    </Button>
                </Link>
                <div className="flex flex-col items-center justify-center mb-8">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-main)] to-[var(--text-dim)]">Chat with Admin</h1>
                    <p className="text-[var(--text-dim)] mt-2 text-center max-w-md">
                        Get direct support, ask questions about your account, or report issues to our administrator.
                    </p>
                </div>
            </div>

            <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl mb-8">
                {/* Messages Area */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-black/5 dark:bg-white/5"
                >
                    {messages.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-[var(--text-dim)] italic">
                            No messages yet. Start a conversation!
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isAdmin = msg.senderRole === 'admin';
                            return (
                                <div 
                                    key={msg.id}
                                    className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                                >
                                    <motion.div 
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        className={`max-w-[70%] flex flex-col cursor-default ${isAdmin ? 'items-start' : 'items-end'}`}
                                    >
                                        <div className={`px-4 py-2 rounded-2xl text-sm flex flex-col gap-2 ${
                                            isAdmin 
                                                ? 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-main)] rounded-tl-none' 
                                                : 'bg-[#111827] text-white dark:bg-white dark:text-black rounded-tr-none'
                                        }`}>
                                            {msg.message && <div>{msg.message}</div>}
                                            {msg.attachmentUrl && (
                                                <div className={`p-2 rounded-xl border ${isAdmin ? 'bg-white/5 border-white/10' : 'bg-black/10 border-black/10 dark:bg-black/20 dark:border-white/10'}`}>
                                                    {msg.attachmentType?.startsWith('image/') ? (
                                                        <div className="flex flex-col gap-2">
                                                            <img src={msg.attachmentUrl} alt={msg.attachmentName} className="max-w-full rounded-lg max-h-64 object-contain shadow-sm" />
                                                            <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] opacity-70 hover:opacity-100 transition-opacity">
                                                                <ExternalLink className="w-3 h-3" /> View original
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-3 min-w-[180px]">
                                                            <div className="p-2 rounded-lg bg-blue-500/10">
                                                                <FileText className="w-6 h-6 text-blue-500" />
                                                            </div>
                                                            <div className="flex-1 overflow-hidden">
                                                                <p className="font-medium text-xs truncate">{msg.attachmentName}</p>
                                                                <a 
                                                                    href={msg.attachmentUrl} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-1 text-[10px] text-blue-500 hover:underline mt-1"
                                                                >
                                                                    <Download className="w-3 h-3" /> Download
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-[var(--text-dim)] mt-1 px-1">
                                            {format(new Date(msg.createdAt), 'HH:mm')}
                                        </span>
                                    </motion.div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-[var(--glass-border)] bg-[var(--glass-bg)] flex flex-col gap-3">
                    {attachment && (
                        <div className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] flex items-center justify-between group animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                                    {attachment.type.startsWith('image/') ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                </div>
                                <span className="text-xs font-medium truncate max-w-[200px]">{attachment.name}</span>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setAttachment(null)}
                                className="h-6 w-6 rounded-full hover:bg-red-500/10 hover:text-red-500"
                            >
                                <X className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    )}
                    
                    <form 
                        onSubmit={handleSendMessage}
                        className="flex gap-2 items-center"
                    >
                        <div className="relative flex-1 flex items-center">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={attachment ? "Add a caption..." : "Type your message..."}
                                className="flex-1 h-12 bg-white/5 border-white/10 rounded-xl pr-12"
                                disabled={isSending}
                            />
                            <div className="absolute right-2">
                                <UploadButton
                                    endpoint="chatAttachments"
                                    onClientUploadComplete={(res) => {
                                        if (res && res[0]) {
                                            setAttachment({
                                                url: res[0].url,
                                                name: res[0].name,
                                                type: (res[0] as any).type || (res[0].name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream')
                                            });
                                            toast.success("File ready to send");
                                        }
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast.error(`Error uploading: ${error.message}`);
                                    }}
                                    content={{
                                        button: <Paperclip className="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />,
                                        allowedContent: null
                                    }}
                                    appearance={{
                                        button: "bg-transparent border-0 h-10 w-10 p-0 text-[var(--text-dim)] shadow-none after:hidden flex items-center justify-center",
                                        allowedContent: "hidden"
                                    }}
                                />
                            </div>
                        </div>
                        <Button 
                            type="submit" 
                            disabled={isSending || (!newMessage.trim() && !attachment)}
                            className="h-12 w-12 rounded-full bg-[#111827] dark:bg-white text-white dark:text-black shrink-0 shadow-lg hover:scale-105 transition-transform"
                        >
                            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
