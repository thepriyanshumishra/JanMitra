"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Bell, Moon, Shield, Globe, Smartphone, Save, Sparkles, Download, Trash2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeTransition, TransitionType } from "@/hooks/use-theme-transition";
import { toast } from "sonner";

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [publicProfile, setPublicProfile] = useState(false);
    const { transitionType, setTransitionType } = useThemeTransition();

    return (
        <div className="relative max-w-5xl mx-auto space-y-8 p-4">
            {/* Background Blobs */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                        Settings
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your preferences and account security.</p>
                </div>
                <button
                    onClick={() => toast.success("Settings Saved", { description: "Your preferences have been updated." })}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95"
                >
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Appearance */}
                <GlassPanel className="p-6 border-white/30 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                            <Moon className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Appearance</h2>
                    </div>

                    <Toggle
                        label="Dark Mode"
                        desc="Use the system dark theme preference."
                        checked={darkMode}
                        onChange={setDarkMode}
                    />

                    {/* Theme Transition Selector */}
                    <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <label className="text-sm font-bold text-slate-900 dark:text-white">Theme Transition</label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {(["circular", "wipe", "vertical-wipe", "fade"] as TransitionType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setTransitionType(type)}
                                    className={cn(
                                        "px-3 py-2.5 text-xs font-bold rounded-xl border transition-all capitalize flex items-center justify-center gap-2",
                                        transitionType === type
                                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                                            : "bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800"
                                    )}
                                >
                                    {type.replace("-", " ")}
                                    {transitionType === type && <CheckCircle className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </GlassPanel>

                {/* Notifications */}
                <GlassPanel className="p-6 border-white/30 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <Bell className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
                    </div>

                    <Toggle
                        label="Push Notifications"
                        desc="Receive alerts for grievance updates."
                        checked={notifications}
                        onChange={setNotifications}
                    />
                    <Toggle
                        label="Email Digest"
                        desc="Weekly summary of neighborhood activity."
                        checked={true}
                        onChange={() => { }}
                    />
                </GlassPanel>

                {/* Privacy */}
                <GlassPanel className="p-6 border-white/30 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Privacy & Security</h2>
                    </div>

                    <Toggle
                        label="Public Profile"
                        desc="Allow others to see your civic score."
                        checked={publicProfile}
                        onChange={setPublicProfile}
                    />
                    <Toggle
                        label="2-Factor Auth"
                        desc="Secure your account with OTP."
                        checked={true}
                        onChange={() => { }}
                    />
                </GlassPanel>

                {/* Data & System */}
                <GlassPanel className="p-6 border-white/30 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                            <Globe className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Data & System</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/30 dark:bg-slate-800/30 border border-white/40 dark:border-white/5 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    <Download className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Export Data</p>
                                    <p className="text-xs text-slate-500">Download your grievance history</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                    <Trash2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
                                    <p className="text-xs text-red-400/80">Permanently remove all data</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Version</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">v1.0.0 (Beta)</p>
                        </div>
                        <span className="px-2 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold border border-green-500/20">
                            LATEST
                        </span>
                    </div>
                </GlassPanel>

                {/* Developer Zone (Temporary) */}
                <GlassPanel className="md:col-span-2 p-6 border-red-500/30 bg-red-500/5 backdrop-blur-xl shadow-2xl space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                            <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Developer Zone</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Testing tools - Remove in production</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-red-200 dark:border-red-900/30">
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">Role Switcher</p>
                            <p className="text-xs text-slate-500">Force switch your user role for testing.</p>
                        </div>
                        <div className="flex gap-2">
                            {["citizen", "officer", "admin"].map((role) => (
                                <button
                                    key={role}
                                    onClick={async () => {
                                        const { updateProfile } = await import("@/app/actions/profile");
                                        const res = await updateProfile({ role });
                                        if (res.success) {
                                            toast.success(`Switched to ${role}`);
                                            window.location.reload();
                                        } else {
                                            toast.error("Failed to switch role");
                                        }
                                    }}
                                    className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold uppercase hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}

function Toggle({ label, desc, checked, onChange }: any) {
    return (
        <div className="flex items-center justify-between group">
            <div>
                <p className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{label}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={cn(
                    "w-12 h-7 rounded-full transition-all duration-300 relative shadow-inner",
                    checked ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                )}
            >
                <div className={cn(
                    "absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 transform",
                    checked ? "translate-x-5" : "translate-x-0"
                )} />
            </button>
        </div>
    );
}

function CheckCircle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
}
