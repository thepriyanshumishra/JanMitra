"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Bell, Moon, Shield, Globe, Smartphone, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [publicProfile, setPublicProfile] = useState(false);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your preferences and account security.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Appearance */}
                <GlassPanel className="p-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                            <Moon className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h2>
                    </div>

                    <Toggle
                        label="Dark Mode"
                        desc="Use the system dark theme preference."
                        checked={darkMode}
                        onChange={setDarkMode}
                    />
                    <Toggle
                        label="Reduced Motion"
                        desc="Minimize animations for accessibility."
                        checked={false}
                        onChange={() => { }}
                    />
                </GlassPanel>

                {/* Notifications */}
                <GlassPanel className="p-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            <Bell className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h2>
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
                <GlassPanel className="p-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Privacy & Security</h2>
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

                {/* System */}
                <GlassPanel className="p-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                            <Globe className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">System</h2>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Language</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">English (US)</p>
                        </div>
                        <button className="text-sm text-blue-600 dark:text-blue-400 font-medium">Change</button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Version</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">v1.0.0 (Beta)</p>
                        </div>
                        <span className="px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">LATEST</span>
                    </div>
                </GlassPanel>
            </div>

            <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20">
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>
        </div>
    );
}

function Toggle({ label, desc, checked, onChange }: any) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="font-medium text-slate-900 dark:text-white">{label}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={cn(
                    "w-11 h-6 rounded-full transition-colors relative",
                    checked ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                )}
            >
                <div className={cn(
                    "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                    checked ? "translate-x-5" : "translate-x-0"
                )} />
            </button>
        </div>
    );
}
