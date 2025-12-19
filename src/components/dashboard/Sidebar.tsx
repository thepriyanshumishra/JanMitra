"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutDashboard, PenTool, BarChart3, Settings, LogOut, ShieldCheck, FileText, Search, User } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/hooks/useRole";

import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";

import { NotificationBell } from "@/components/ui/NotificationBell";

export function Sidebar({ className }: { className?: string }) {
    const { user, signOut } = useAuth();
    const { role } = useRole();
    const { t } = useLanguage();
    const pathname = usePathname();

    const searchParams = useSearchParams();
    const currentView = searchParams.get('view');

    const navItems = [
        {
            name: t("nav_overview"),
            href: role === "admin" ? "/dashboard/admin" : "/dashboard/citizen",
            icon: LayoutDashboard
        },
        { name: t("nav_submit"), href: "/dashboard/submit", icon: PenTool },
        { name: "Track Complaint", href: "/dashboard/track", icon: Search },
        { name: "My Drafts", href: "/dashboard/drafts", icon: FileText },
        { name: "My Submissions", href: "/dashboard/submissions", icon: ShieldCheck },
        { name: "My Profile", href: "/dashboard/profile", icon: User },
        { name: t("nav_ledger"), href: "/dashboard/ledger", icon: ShieldCheck },
        { name: t("nav_analytics"), href: "/dashboard/analytics", icon: BarChart3 },
        { name: t("nav_settings"), href: "/dashboard/settings", icon: Settings },
    ];

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
                            Sign Out
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
                            Go Home
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
                    <Link href="/">
                        <Logo />
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-2 space-y-1">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {t("apps_label")}
                    </div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
                                        isActive
                                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white hover:scale-105"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white")} />
                                    <span>{item.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                    {role === "admin" && (
                        <div
                            onClick={() => window.location.href = "https://janmitraportal.vercel.app/admin"}
                            className="cursor-pointer"
                        >
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium bg-gradient-to-r from-red-500/10 to-orange-500/10 hover:from-red-500/20 hover:to-orange-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 mb-2">
                                <ShieldCheck className="w-4 h-4" />
                                <span>{t("nav_admin")}</span>
                            </div>
                        </div>
                    )}
                </nav>


                {/* Footer / User Profile */}
                <div className="p-3 mt-2 bg-white/30 dark:bg-black/10 backdrop-blur-sm border-t border-white/10 space-y-3">
                    {/* Language Selector & Theme Toggle */}
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <LanguageSelector />
                        </div>
                        <NotificationBell />
                        <ThemeToggle />
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-inner ring-2 ring-white/20 group-hover:ring-blue-400 transition-all">
                            {user?.email?.[0].toUpperCase() || "JD"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user?.email?.split('@')[0] || "Guest"}</p>
                            <p className={cn(
                                "text-[10px] font-medium truncate capitalize",
                                role === "admin" ? "text-red-500 font-bold" :
                                    role === "officer" ? "text-purple-500 font-semibold" :
                                        "text-slate-500 dark:text-slate-400"
                            )}>
                                {role === "admin" ? "🛡️ Admin" : role === "officer" ? "👮 Officer" : "👤 Citizen"}
                            </p>
                        </div>
                        <button onClick={signOut} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors" title={t("sign_out")}>
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
