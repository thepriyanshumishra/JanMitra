"use client";

import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="relative w-8 h-8 flex items-center justify-center">
                {/* Abstract Shield/Node Icon */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full text-blue-600 dark:text-blue-500"
                >
                    <defs>
                        <linearGradient id="logo-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M12 2L3 7V12C3 17.5228 7.47715 22 12 22C16.5228 22 21 17.5228 21 12V7L12 2Z"
                        className="fill-blue-100 dark:fill-blue-900/30 stroke-[url(#logo-gradient)] stroke-2"
                    />
                    <path
                        d="M12 8V16M8 12H16"
                        stroke="url(#logo-gradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <circle cx="12" cy="12" r="2" fill="url(#logo-gradient)" />
                </svg>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full -z-10" />
            </div>

            {showText && (
                <span className="font-bold text-lg text-slate-800 dark:text-white tracking-tight">
                    JAN-MITRA
                </span>
            )}
        </div>
    );
}
