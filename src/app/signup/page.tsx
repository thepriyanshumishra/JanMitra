"use client";

import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { ArrowLeft, ArrowRight, Lock, Mail, User } from "lucide-react";

export default function SignupPage() {
    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
            <AnimatedBackground />

            <div className="absolute top-6 left-6 z-20">
                <Link href="/">
                    <button className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors backdrop-blur-md">
                        <ArrowLeft className="w-6 h-6 text-slate-900 dark:text-white" />
                    </button>
                </Link>
            </div>

            <GlassPanel className="p-8 max-w-md w-full space-y-8 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 shadow-2xl">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Join Jan-Mitra</h1>
                    <p className="text-slate-500 dark:text-slate-400">Create your digital citizen identity.</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                placeholder="citizen@jan-mitra.gov"
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <Link href="/dashboard" className="block">
                        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group">
                            Create Account
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </form>

                <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                        Sign in
                    </Link>
                </div>
            </GlassPanel>
        </main>
    );
}
