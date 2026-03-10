"use client";

// Bumping file to trigger Turbopack re-parse

import { useState, useEffect, useRef } from "react";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Send, Search, Loader2, Building2, MessageSquare, Paperclip, FileText, Download, X, ExternalLink, Image as ImageIcon } from "lucide-react";
import { 
    getAllConversationsForAdmin, 
    getConversationMessages, 
    sendMessage, 
    markMessagesAsRead,
    searchCompaniesForChat,
    getOrCreateConversation
} from "@/actions/chatActions";
import { format } from "date-fns";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";

export default function AdminChatPage() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConv, setSelectedConv] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoadingConvs, setIsLoadingConvs] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [attachment, setAttachment] = useState<{ url: string, name: string, type: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearchingResults, setIsSearchingResults] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    const loadConversations = async () => {
        const res = await getAllConversationsForAdmin();
        if (res.success && res.conversations) {
            // Use functional update to avoid race conditions and deduplicate just in case
            setConversations(prev => {
                const combined = [...res.conversations];
                // Check if any manually added conversations (not yet in server list) need to be preserved
                // Though usually res.conversations is the source of truth
                return combined;
            });
        }
        setIsLoadingConvs(false);
    };

    useEffect(() => {
        loadConversations();
        const interval = setInterval(loadConversations, 15000); // Slightly slower list refresh
        return () => clearInterval(interval);
    }, []);

    // Debounced Search for new companies
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchTerm.trim().length >= 2) {
                setIsSearchingResults(true);
                const res = await searchCompaniesForChat(searchTerm);
                if (res.success && res.results) {
                    // Filter out companies that already have a conversation in the current list
                    const existingCompanyIds = conversations.map(c => c.companyId);
                    const filteredResults = res.results.filter((r: any) => !existingCompanyIds.includes(r.companyId));
                    setSearchResults(filteredResults);
                }
                setIsSearchingResults(false);
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, conversations]);

    const handleSelectConversation = async (conv: any) => {
        setSelectedConv(conv);
        setIsLoadingMessages(true);
    };

    const handleStartConversation = async (company: any) => {
        setIsLoadingMessages(true);
        const res = await getOrCreateConversation(company.companyId);
        if (res.success && res.conversation) {
            setConversations(prev => {
                if (prev.find(c => c.id === res.conversation.id)) return prev;
                return [res.conversation, ...prev];
            });
            setSelectedConv(res.conversation);
            setSearchTerm(""); // Clear search on start
        } else {
            toast.error(res.error || "Failed to start conversation");
            setIsLoadingMessages(false);
        }
    };

    const loadMessages = async (convId: string) => {
        const res = await getConversationMessages(convId);
        if (res.success && res.messages) {
            setMessages(res.messages);
            await markMessagesAsRead(convId, 'admin');
        }
        setIsLoadingMessages(false);
        setTimeout(scrollToBottom, 100);
    };

    useEffect(() => {
        if (selectedConv) {
            loadMessages(selectedConv.id);
            const interval = setInterval(() => loadMessages(selectedConv.id), 5000); // Refresh messages every 5s
            return () => clearInterval(interval);
        }
    }, [selectedConv]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newMessage.trim() && !attachment) || !selectedConv || isSending) return;

        setIsSending(true);
        const res = await sendMessage(
            selectedConv.id, 
            newMessage.trim() || null, 
            'admin',
            attachment?.url,
            attachment?.name,
            attachment?.type
        );
        if (res.success && res.message) {
            setNewMessage("");
            setAttachment(null);
            setMessages(prev => [...prev, res.message]);
            setTimeout(scrollToBottom, 50);
            loadConversations(); // Update last message in list
        } else {
            toast.error(res.error || "Failed to send message");
        }
        setIsSending(false);
    };

    const filteredConversations = conversations.filter(conv => 
        conv.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 p-6 h-[calc(100vh-100px)]">
            <GradientHeader
                title="Company Chat Support"
                subtitle="Manage communications with employers on the platform."
                align="left"
                className="py-0"
            />

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Left Panel: Conversations List */}
                <GlassCard hoverLift={false} className="w-80 flex flex-col overflow-hidden border-[var(--glass-border)]">
                    <div className="p-4 border-b border-[var(--glass-border)]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
                            <Input 
                                placeholder="Search companies..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-white/5 border-white/10 rounded-xl"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto hide-scrollbar">
                        {isLoadingConvs ? (
                            <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[var(--primary)]" /></div>
                        ) : (
                            <div className="flex flex-col">
                                {/* Search Results Section */}
                                {searchResults.length > 0 && (
                                    <div className="border-b border-[var(--glass-border)] bg-blue-500/5">
                                        <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-blue-500">New Search Results</p>
                                        {searchResults.map((result) => (
                                            <button
                                                key={result.companyId}
                                                onClick={() => handleStartConversation(result)}
                                                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all text-left group"
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-bold text-sm text-[var(--text-main)]">{result.companyName}</span>
                                                    <span className="text-[10px] text-blue-500 flex items-center gap-1">
                                                        <MessageSquare className="w-3 h-3" /> Start new chat
                                                    </span>
                                                </div>
                                                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Send className="w-3 h-3 text-blue-500" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {filteredConversations.length === 0 && searchResults.length === 0 ? (
                                    <div className="p-8 text-center text-[var(--text-dim)] text-sm">No companies found.</div>
                                ) : (
                                    <>
                                        {searchResults.length > 0 && filteredConversations.length > 0 && (
                                            <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)] border-b border-[var(--glass-border)]">Active Chats</p>
                                        )}
                                        {filteredConversations.map((conv) => (
                                            <motion.button
                                                key={conv.id}
                                                whileHover={{ scale: 1.01, x: 4 }}
                                                onClick={() => handleSelectConversation(conv)}
                                                className={`w-full p-4 flex flex-col gap-1 text-left transition-all border-b border-[var(--glass-border)] hover:bg-white/5 ${
                                                    selectedConv?.id === conv.id ? 'bg-black/10 dark:bg-white/10 border-l-4 border-l-[#111827] dark:border-l-white' : ''
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <span className="font-bold text-sm text-[var(--text-main)] truncate max-w-[150px]">
                                                        {conv.companyName || "Unknown Company"}
                                                    </span>
                                                    {conv.unreadCount > 0 && (
                                                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">
                                                            {conv.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-[var(--text-dim)] truncate">
                                                    {conv.lastMessage}
                                                </p>
                                                <span className="text-[10px] text-[var(--text-dim)]/60 mt-1">
                                                    {format(new Date(conv.lastMessageAt), 'MMM d, HH:mm')}
                                                </span>
                                            </motion.button>
                                        ))}
                                    </>
                                )}
                                {isSearchingResults && (
                                    <div className="p-4 text-center"><Loader2 className="w-4 h-4 animate-spin mx-auto text-[var(--primary)] opacity-50" /></div>
                                )}
                            </div>
                        )}
                    </div>
                </GlassCard>

                {/* Right Panel: Chat Window */}
                <GlassCard hoverLift={false} className="flex-1 flex flex-col overflow-hidden border-[var(--glass-border)] shadow-xl relative">
                    {selectedConv ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-[var(--glass-border)] bg-black/5 dark:bg-white/5 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                    <Building2 className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[var(--text-main)]">{selectedConv.companyName}</h4>
                                    <p className="text-[10px] text-[var(--text-dim)]">Employer ID: {selectedConv.companyId}</p>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div 
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-black/5 dark:bg-white/5"
                            >
                                {isLoadingMessages ? (
                                    <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" /></div>
                                ) : messages.length === 0 ? (
                                    <div className="flex-1 flex items-center justify-center text-[var(--text-dim)] italic">No messages in this conversation.</div>
                                ) : (
                                    messages.map((msg) => {
                                        const isEmployer = msg.senderRole === 'employer';
                                        return (
                                            <div 
                                                key={msg.id}
                                                className={`flex ${isEmployer ? 'justify-start' : 'justify-end'}`}
                                            >
                                                <motion.div 
                                                    whileHover={{ scale: 1.02, y: -2 }}
                                                    className={`max-w-[70%] flex flex-col cursor-default ${isEmployer ? 'items-start' : 'items-end'}`}
                                                >
                                                    <div className={`px-4 py-2 rounded-2xl text-sm flex flex-col gap-2 ${
                                                        isEmployer 
                                                            ? 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-main)] rounded-tl-none' 
                                                            : 'bg-[#111827] text-white dark:bg-white dark:text-black rounded-tr-none shadow-lg'
                                                    }`}>
                                                        {msg.message && <div>{msg.message}</div>}
                                                        {msg.attachmentUrl && (
                                                            <div className={`p-2 rounded-xl border ${isEmployer ? 'bg-white/5 border-white/10' : 'bg-black/10 border-black/10 dark:bg-black/20 dark:border-white/10'}`}>
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
                                            placeholder={attachment ? "Add a caption..." : "Type a reply..."}
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
                                        className="h-12 px-6 rounded-xl bg-[#111827] dark:bg-white text-white dark:text-black shrink-0 flex gap-2 hover:opacity-90"
                                    >
                                        {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Send</>}
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-dim)] gap-4">
                            <div className="p-6 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--glass-border)]">
                                <MessageSquare className="w-12 h-12 opacity-20" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-[var(--text-main)]">Your Messages</h3>
                                <p className="text-sm">Select a company from the left to view or start a conversation.</p>
                            </div>
                        </div>
                    )}
                </GlassCard>
            </div>
        </div>
    );
}
