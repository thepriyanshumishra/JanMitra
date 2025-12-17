"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PenTool, BarChart3, Settings, LogOut, ShieldCheck } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Submit Grievance", href: "/dashboard/submit", icon: PenTool },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Public Ledger", href: "/dashboard/ledger", icon: ShieldCheck },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 z-40 p-4">
            <GlassPanel className="h-full flex flex-col bg-white/40 dark:bg-slate-900/40 border-white/60 dark:border-white/10 backdrop-blur-xl">
                {/* Logo Area */}
                <div className="p-6 border-b border-white/20 dark:border-white/5">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                            <span className="text-white font-bold text-xs">JM</span>
                        </div>
                        <span className="font-bold text-lg text-slate-800 dark:text-white tracking-tight">
                            JAN-MITRA
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                        isActive
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                            : "hover:bg-white/40 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                    )}
                                >
                                    <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white")} />
                                    <span className="font-medium">{item.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-white/20 dark:border-white/5">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors group">
                        <LogOut className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-red-500" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </GlassPanel>
        </aside>
    );
}
