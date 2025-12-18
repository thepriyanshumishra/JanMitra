"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface MessageBubbleProps {
    role: "user" | "assistant";
    content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
    const isAi = role === "assistant";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex w-full gap-3 mb-4",
                isAi ? "justify-start" : "justify-end"
            )}
        >
            {isAi && (
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
            )}

            <div
                className={cn(
                    "max-w-[80%] p-3.5 px-5 rounded-2xl text-[15px] leading-relaxed shadow-sm relative",
                    isAi
                        ? "bg-[#E9E9EB] dark:bg-[#3A3A3C] text-black dark:text-white rounded-tl-sm" // AI: System Gray
                        : "bg-gradient-to-b from-[#007AFF] to-[#0062CC] text-white rounded-tr-sm" // User: iMessage Blue
                )}
            >
                {content}
            </div>

            {!isAi && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                </div>
            )}
        </motion.div>
    );
}
