"use client";

import { motion } from "framer-motion";

interface SuretyGaugeProps {
    score: number;
}

export function SuretyGauge({ score }: SuretyGaugeProps) {
    // Color logic based on score
    const getColor = (s: number) => {
        if (s < 30) return "text-red-500 stroke-red-500";
        if (s < 70) return "text-amber-500 stroke-amber-500";
        return "text-green-500 stroke-green-500";
    };

    const colorClass = getColor(score);
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm">
            <div className="relative w-10 h-10 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="20"
                        cy="20"
                        r={radius}
                        className="stroke-slate-200 dark:stroke-slate-700 fill-none"
                        strokeWidth="3"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        cx="20"
                        cy="20"
                        r={radius}
                        className={`fill-none ${colorClass}`}
                        strokeWidth="3"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                    />
                </svg>
                <span className={`absolute text-[10px] font-bold ${colorClass.split(" ")[0]}`}>
                    {score}%
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Data Surety
                </span>
                <span className={`text-sm font-bold ${colorClass.split(" ")[0]}`}>
                    {score < 30 ? "Low Details" : score < 70 ? "Getting There" : "Excellent"}
                </span>
            </div>
        </div>
    );
}
