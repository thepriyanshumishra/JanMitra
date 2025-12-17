"use client";

import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function EscalationTimer({ initialSeconds = 60 }: { initialSeconds?: number }) {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [escalated, setEscalated] = useState(false);

    useEffect(() => {
        if (seconds <= 0) {
            setEscalated(true);
            return;
        }

        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds]);

    if (escalated) {
        return (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                ESCALATED TO MAYOR
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-mono font-medium">
            <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Auto-Escalate in:</span>
            <span className={cn(
                "px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800",
                seconds < 10 && "text-red-600 dark:text-red-400 animate-ping"
            )}>
                00:{seconds.toString().padStart(2, '0')}
            </span>
        </div>
    );
}
