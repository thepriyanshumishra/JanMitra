"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const ALERTS = [
    "CRITICAL: Water main burst in Sector 4 - Repair crews dispatched.",
    "UPDATE: Power restored in Civil Lines area.",
    "NOTICE: Road maintenance scheduled for Main Market tomorrow.",
    "ALERT: Heavy rain forecast - Drainage teams on standby.",
    "SECURITY: Night patrol increased in Tech Park following reports."
];

export function NewsTicker() {
    return (
        <div className="w-full h-10 bg-red-500/10 border-y border-red-500/20 flex items-center overflow-hidden relative backdrop-blur-sm">
            {/* Static Badge */}
            <div className="absolute left-0 h-full px-4 bg-red-950/80 backdrop-blur-md flex items-center z-20 border-r border-red-500/30 shadow-lg shadow-red-900/20">
                <span className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 animate-pulse" />
                    Live Alerts
                </span>
            </div>

            {/* Scrolling Track */}
            <div className="flex items-center overflow-hidden w-full mask-linear-fade">
                <motion.div
                    className="flex items-center gap-16 whitespace-nowrap flex-nowrap pl-[140px]" // Initial padding to start after badge
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 40,
                        ease: "linear"
                    }}
                >
                    {/* Duplicate content 4 times to ensure smooth loop on wide screens */}
                    {[...ALERTS, ...ALERTS, ...ALERTS, ...ALERTS].map((alert, i) => (
                        <span key={i} className="text-sm font-medium text-red-400/90 inline-flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                            {alert}
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
