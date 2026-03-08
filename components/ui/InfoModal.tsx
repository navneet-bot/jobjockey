"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-md",
            className
        )}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function InfoModal({ isOpen, onClose, title, children }: InfoModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AnimatePresence>
                {isOpen && (
                    <DialogPortal forceMount>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <DialogOverlay className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md" />
                        </motion.div>

                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <DialogPrimitive.Content asChild>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.96, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.96, y: 20 }}
                                    transition={{
                                        ease: "easeOut",
                                        duration: 0.6
                                    }}
                                    className={cn(
                                        "relative w-full max-w-lg bg-white dark:bg-[var(--glass-bg)] border-[var(--glass-border)] p-8 shadow-2xl rounded-[32px] overflow-hidden focus:outline-none backdrop-blur-xl"
                                    )}
                                >
                                    {/* Inner Glow Effect */}
                                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1),_transparent)] dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent)]" />

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <DialogPrimitive.Title className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
                                                {title}
                                            </DialogPrimitive.Title>
                                            <DialogPrimitive.Close className="p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-all duration-200 text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)] group">
                                                <motion.div
                                                    whileHover={{ rotate: 90, scale: 1.15 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <X className="w-5 h-5" />
                                                </motion.div>
                                                <span className="sr-only">Close</span>
                                            </DialogPrimitive.Close>
                                        </div>

                                        <div className="text-foreground/80 font-sans leading-relaxed space-y-4">
                                            {children}
                                        </div>
                                    </div>
                                </motion.div>
                            </DialogPrimitive.Content>
                        </div>
                    </DialogPortal>
                )}
            </AnimatePresence>
        </Dialog>
    );
}
