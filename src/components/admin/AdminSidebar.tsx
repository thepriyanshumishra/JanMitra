"use client";

import { Home, Users, Building2, MessageSquare, BarChart3, LogOut, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { Logo } from "@/components/ui/Logo";

const adminNavItems = [
    { icon: Home, label: "Dashboard", href: "/admin" },
    { icon: Shield, label: "Approvals", href: "/admin/approvals" },
    { icon: MessageSquare, label: "All Grievances", href: "/admin/grievances" },
    { icon: Users, label: "User Management", href: "/admin/users" },
    { icon: Building2, label: "Departments", href: "/admin/departments" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
];

import { useLanguage } from "@/context/LanguageContext";

export function AdminSidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const { profile, signOut } = useAuth();
    const { t } = useLanguage();

    return (
        <aside className={cn("hidden md:flex flex-col w-64 h-auto fixed left-6 top-1/2 -translate-y-1/2 z-40", className)}>
            {/* Floating Dock Container */}
            <div className="flex flex-col bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2rem] shadow-2xl shadow-black/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-black/20">

                {/* Traffic Lights (Mac Style) */}
                <div className="px-6 pt-5 pb-2 flex gap-2 group/lights">
                    <div className="relative group/btn">
                        <button
                            onClick={signOut}
                            className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm hover:bg-red-600 transition-colors flex items-center justify-center group/red"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-black/20 opacity-0 group-hover/lights:opacity-100 transition-opacity" />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                            {t("sign_out")}
                        </div>
                    </div>

                    <div className="relative group/btn">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-3 h-3 rounded-full bg-amber-500/80 shadow-sm hover:bg-amber-600 transition-colors flex items-center justify-center"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-black/20 opacity-0 group-hover/lights:opacity-100 transition-opacity" />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                            {t("nav_overview")}
                        </div>
                    </div>

                    <div className="relative group/btn">
                        <button
                            onClick={() => {
                                if (!document.fullscreenElement) {
                                    document.documentElement.requestFullscreen();
                                } else {
                                    document.exitFullscreen();
                                }
                            }}
                            className="w-3 h-3 rounded-full bg-green-500/80 shadow-sm hover:bg-green-600 transition-colors flex items-center justify-center"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-black/20 opacity-0 group-hover/lights:opacity-100 transition-opacity" />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                            Fullscreen
                        </div>
                    </div>
                </div>

                {/* Logo Area */}
                <div className="px-6 py-3">
                    <Link href="/admin">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                                Admin
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-2 space-y-1">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        System
                    </div>
                    {adminNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
                                        isActive
                                            ? "bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white hover:scale-105"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white")} />
                                    <span>{item.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                    <div
                        onClick={() => window.location.href = "https://janmitraportal.vercel.app/dashboard"}
                        className="cursor-pointer"
                    >
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white hover:scale-105 mt-4 border-t border-slate-200 dark:border-white/10 pt-4">
                            <Home className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white" />
                            <span>{t("nav_dashboard_link")}</span>
                        </div>
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-3 mt-2 bg-white/30 dark:bg-black/10 backdrop-blur-sm border-t border-white/10 space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <LanguageSelector />
                        </div>
                        <ThemeToggle />
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-inner ring-2 ring-white/20 group-hover:ring-red-400 transition-all">
                            {profile?.full_name?.[0]?.toUpperCase() || "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{profile?.full_name || "Admin"}</p>
                            <p className="text-[10px] font-medium text-red-500 font-bold truncate">🛡️ Administrator</p>
                        </div>
                        <button onClick={signOut} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors" title="Sign Out">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
