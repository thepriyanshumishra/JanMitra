"use client";

import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
            <AnimatedBackground />

            <GlassPanel className="p-12 max-w-lg w-full text-center space-y-8 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 shadow-2xl">
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center animate-pulse">
                        <SearchX className="w-12 h-12 text-red-500 dark:text-red-400" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">404</h1>
                    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Page Not Found</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        The requested resource could not be found on the decentralized network.
                    </p>
                </div>

                <div className="flex justify-center gap-4">
                    <Link href="/dashboard">
                        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Return to Dashboard
                        </button>
                    </Link>
                </div>
            </GlassPanel>
        </main>
    );
}
