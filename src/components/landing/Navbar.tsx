"use client";

import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ArrowRight } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-center">
            <GlassPanel className="w-full max-w-5xl px-6 py-3 flex items-center justify-between bg-white/40 dark:bg-slate-900/40 border-white/60 dark:border-white/10 backdrop-blur-xl shadow-lg">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-xs">JM</span>
                    </div>
                    <span className="font-bold text-lg text-slate-800 dark:text-white tracking-tight">
                        JAN-MITRA
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        About
                    </Link>
                    <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        Login
                    </Link>
                    <Link href="/signup">
                        <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 group">
                            Sign Up
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>

                {/* Mobile Nav Trigger (Simple Link for now) */}
                <div className="md:hidden">
                    <Link href="/login" className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        Login
                    </Link>
                </div>
            </GlassPanel>
        </nav>
    );
}
