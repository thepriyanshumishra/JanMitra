"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, LogOut, Shield, Users, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/hooks/useRole";
import { LanguageSelector } from "@/components/ui/LanguageSelector";

export function OfficerSidebar({ className }: { className?: string }) {
    const { user, signOut } = useAuth();
    const { role } = useRole();
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/dashboard/officer", icon: LayoutDashboard },
        { name: "My Assignments", href: "/dashboard/officer/assignments", icon: ClipboardList },
        { name: "Department", href: "/dashboard/officer/department", icon: Users },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
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
                    </div>
                    <div className="relative group/btn">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-3 h-3 rounded-full bg-amber-500/80 shadow-sm hover:bg-amber-600 transition-colors flex items-center justify-center"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-black/20 opacity-0 group-hover/lights:opacity-100 transition-opacity" />
                        </button>
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
                    <div className="px-3 py-2 text-[10px] font-bold text-purple-500 uppercase tracking-widest flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        Officer Portal
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
                                            ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30 scale-105"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white hover:scale-105"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white")} />
                                    <span>{item.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / User Profile */}
                <div className="p-3 mt-2 bg-white/30 dark:bg-black/10 backdrop-blur-sm border-t border-white/10 space-y-3">
                    {/* Language Selector & Theme Toggle */}
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <LanguageSelector />
                        </div>
                        <ThemeToggle />
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-inner ring-2 ring-white/20 group-hover:ring-purple-400 transition-all">
                            {user?.email?.[0].toUpperCase() || "OF"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user?.email?.split('@')[0] || "Officer"}</p>
                            <p className="text-[10px] font-semibold text-purple-500 truncate capitalize">
                                👮 Officer
                            </p>
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
