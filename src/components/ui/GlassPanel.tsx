"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    gradient?: boolean;
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
    ({ children, className, gradient = false, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={cn(
                    "relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl",
                    "transition-all duration-300 hover:bg-white/15 hover:border-white/30",
                    "before:absolute before:inset-0 before:rounded-2xl before:border before:border-white/10 before:pointer-events-none", // Inner ring effect
                    gradient && "bg-gradient-to-br from-white/10 to-white/5",
                    className
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                {...props}
            >
                {/* Shine effect overlay */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                {children}
            </motion.div>
        );
    }
);

GlassPanel.displayName = "GlassPanel";
