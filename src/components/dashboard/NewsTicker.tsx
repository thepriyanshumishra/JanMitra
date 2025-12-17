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
            <div className="absolute left-0 h-full px-4 bg-red-500/20 flex items-center z-10 border-r border-red-500/30">
                <span className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 animate-pulse" />
                    Live Alerts
                </span>
            </div>

            <motion.div
                className="flex items-center gap-12 whitespace-nowrap pl-32"
                animate={{ x: ["0%", "-100%"] }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            >
                {[...ALERTS, ...ALERTS].map((alert, i) => (
                    <span key={i} className="text-sm font-medium text-red-400/90">
                        {alert}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
