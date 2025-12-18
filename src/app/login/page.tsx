"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (error) throw error;

            toast.success("Welcome back!");

            // Check role for redirect
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .single();

                if (profile?.role === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
            } else {
                router.push("/dashboard");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to sign in");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
            <div className="absolute top-6 right-6 z-50 flex items-center gap-2">
                <div className="w-32">
                    <LanguageSelector />
                </div>
                <ThemeToggle />
            </div>
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
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
                    <p className="text-slate-500 dark:text-slate-400">Sign in to access the governance portal.</p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                placeholder="citizen@jan-mitra.gov"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="text-center textsl dark:text-slate-400">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                        Sign up
                    </Link>
                </div>
            </GlassPanel>
        </main>
    );
}
