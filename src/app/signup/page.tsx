"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { ArrowLeft, Lock, Mail, User, Shield, BadgeCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function SignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"citizen" | "officer">("citizen");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role, // Pass role to metadata
                    },
                },
            });

            if (error) throw error;

            if (role === "officer") {
                toast.success("Officer account created! Please wait for admin approval.");
                // Redirect to home or a specific "pending" page
                router.push("/?pending=true");
            } else {
                toast.success("Account created! Redirecting...");
                router.push("/dashboard");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to create account");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
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
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Join Jan-Mitra</h1>
                    <p className="text-slate-500 dark:text-slate-400">Create your digital identity.</p>
                </div>

                {/* Role Selection Tabs */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setRole("citizen")}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all",
                            role === "citizen"
                                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        )}
                    >
                        <User className="w-4 h-4" />
                        Citizen
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole("officer")}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all",
                            role === "officer"
                                ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        )}
                    >
                        <Shield className="w-4 h-4" />
                        Officer
                    </button>
                </div>

                <form className="space-y-6" onSubmit={handleSignup}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder={role === "officer" ? "Officer Name" : "John Doe"}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {role === "officer" ? "Official Email" : "Email Address"}
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                placeholder={role === "officer" ? "officer@dept.gov.in" : "citizen@jan-mitra.gov"}
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

                    {role === "officer" && (
                        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 flex gap-3">
                            <BadgeCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-800 dark:text-amber-300">
                                Officer accounts require admin approval. You will not be able to log in until your account is verified.
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                            "w-full py-3 rounded-lg text-white font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
                            role === "officer"
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/30"
                                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/30"
                        )}
                    >
                        {isLoading ? "Creating account..." : role === "officer" ? "Apply for Officer Account" : "Create Citizen Account"}
                    </button>
                </form>

                <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                        Sign in
                    </Link>
                </div>
            </GlassPanel>
        </main>
    );
}
