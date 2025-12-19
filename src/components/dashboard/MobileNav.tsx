"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NotificationBell } from "@/components/ui/NotificationBell";

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Top Bar (Mobile) */}
            <div className="md:hidden fixed top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/20 text-slate-900 dark:text-white shadow-lg pointer-events-auto"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className="pointer-events-auto">
                    <NotificationBell />
                </div>
            </div>

            {/* Drawer Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-3/4 max-w-xs z-50 md:hidden"
                        >
                            <div className="h-full relative">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <Sidebar className="w-full h-full !static !bg-transparent" />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
