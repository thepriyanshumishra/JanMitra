"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Building2,
    FileText,
    Settings,
    LogOut,
    ShieldAlert
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function AdminSidebar() {
    const pathname = usePathname();
    const { signOut } = useAuth();

    const links = [
        { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/admin/users", label: "User Management", icon: Users },
        { href: "/dashboard/admin/departments", label: "Departments", icon: Building2 },
        { href: "/dashboard/admin/grievances", label: "All Grievances", icon: FileText },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="w-64 h-screen bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-40">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20">
                    <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                    Admin Portal
                </span>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/20"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <Icon className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-white dark:text-slate-900" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                            )} />
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={signOut}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    );
}
