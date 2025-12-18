"use client";

import { useEffect, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Users, MessageSquare, Building2, ShieldCheck, TrendingUp, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface SystemStats {
    totalUsers: number;
    totalGrievances: number;
    activeGrievances: number;
    resolvedGrievances: number;
    totalDepartments: number;
    adminCount: number;
    officerCount: number;
    citizenCount: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<SystemStats>({
        totalUsers: 0,
        totalGrievances: 0,
        activeGrievances: 0,
        resolvedGrievances: 0,
        totalDepartments: 0,
        adminCount: 0,
        officerCount: 0,
        citizenCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSystemStats();
    }, []);

    const fetchSystemStats = async () => {
        try {
            // Fetch user counts
            const { count: totalUsers } = await supabase
                .from("profiles")
                .select("*", { count: "exact", head: true });

            const { count: adminCount } = await supabase
                .from("profiles")
                .select("*", { count: "exact", head: true })
                .eq("role", "admin");

            const { count: officerCount } = await supabase
                .from("profiles")
                .select("*", { count: "exact", head: true })
                .eq("role", "officer");

            const { count: citizenCount } = await supabase
                .from("profiles")
                .select("*", { count: "exact", head: true })
                .eq("role", "citizen");

            // Fetch grievance counts
            const { count: totalGrievances } = await supabase
                .from("grievances")
                .select("*", { count: "exact", head: true });

            const { count: activeGrievances } = await supabase
                .from("grievances")
                .select("*", { count: "exact", head: true })
                .neq("status", "Resolved");

            const { count: resolvedGrievances } = await supabase
                .from("grievances")
                .select("*", { count: "exact", head: true })
                .eq("status", "Resolved");

            // Fetch department count
            const { count: totalDepartments } = await supabase
                .from("departments")
                .select("*", { count: "exact", head: true });

            setStats({
                totalUsers: totalUsers || 0,
                totalGrievances: totalGrievances || 0,
                activeGrievances: activeGrievances || 0,
                resolvedGrievances: resolvedGrievances || 0,
                totalDepartments: totalDepartments || 0,
                adminCount: adminCount || 0,
                officerCount: officerCount || 0,
                citizenCount: citizenCount || 0,
            });
        } catch (error) {
            console.error("Error fetching system stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, label, value, color, bg }: any) => (
        <GlassPanel className={cn("p-6 flex items-center gap-4", bg)}>
            <div className={cn("p-4 rounded-xl", color)}>
                <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{loading ? "..." : value.toLocaleString()}</p>
            </div>
        </GlassPanel>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">System Overview</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Monitor platform-wide activity and manage resources</p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    label="Total Users"
                    value={stats.totalUsers}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                    bg="bg-blue-500/10 border-blue-500/20"
                />
                <StatCard
                    icon={MessageSquare}
                    label="All Grievances"
                    value={stats.totalGrievances}
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                    bg="bg-purple-500/10 border-purple-500/20"
                />
                <StatCard
                    icon={AlertCircle}
                    label="Active Cases"
                    value={stats.activeGrievances}
                    color="bg-gradient-to-br from-orange-500 to-red-500"
                    bg="bg-orange-500/10 border-orange-500/20"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Resolved"
                    value={stats.resolvedGrievances}
                    color="bg-gradient-to-br from-green-500 to-green-600"
                    bg="bg-green-500/10 border-green-500/20"
                />
            </div>

            {/* Role Distribution & Department Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassPanel className="p-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                        Role Distribution
                    </h3>
                    <div className="space-y-3">
                        <RoleBar label="Citizens" count={stats.citizenCount} total={stats.totalUsers} color="bg-blue-500" />
                        <RoleBar label="Officers" count={stats.officerCount} total={stats.totalUsers} color="bg-purple-500" />
                        <RoleBar label="Admins" count={stats.adminCount} total={stats.totalUsers} color="bg-red-500" />
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-purple-500" />
                        Departments
                    </h3>
                    <div className="flex items-center justify-center h-32">
                        <div className="text-center">
                            <p className="text-5xl font-bold text-slate-900 dark:text-white">{stats.totalDepartments}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Active Departments</p>
                        </div>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}

function RoleBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
                <span className="text-slate-500 dark:text-slate-400">{count} ({percentage.toFixed(0)}%)</span>
            </div>
            <div className="h-3 bg-white/30 dark:bg-white/10 rounded-full overflow-hidden">
                <div className={cn("h-full transition-all duration-500", color)} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}
