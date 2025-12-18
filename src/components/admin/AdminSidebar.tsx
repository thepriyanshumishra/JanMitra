"use client";

import { Home, Users, Building2, MessageSquare, BarChart3, LogOut, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSelector } from "@/components/ui/LanguageSelector";

const adminNavItems = [
    { icon: Home, label: "Dashboard", href: "/admin" },
    { icon: Shield, label: "Approvals", href: "/admin/approvals" }, // New Link
    { icon: MessageSquare, label: "All Grievances", href: "/admin/grievances" },
    { icon: Users, label: "User Management", href: "/admin/users" },
    { icon: Building2, label: "Departments", href: "/admin/departments" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { profile, signOut } = useAuth();

    return (
        <div className="h-screen w-64 bg-white/40 dark:bg-black/20 backdrop-blur-xl border-r border-white/20 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900 dark:text-white">Admin Panel</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">System Management</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                                    : "text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <LanguageSelector />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/30 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            {profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                {profile?.full_name || "Admin"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{profile?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={signOut}
                        className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </button>
                </div>
            </div>
        </div>
    );
}
