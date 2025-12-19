"use client";

import { useEffect, useState } from "react";
import { getSystemStats } from "@/app/actions/admin";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Loader2, Users, Building2, FileText, CheckCircle2, TrendingUp, Activity } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    async function loadStats() {
        setIsLoading(true);
        const res = await getSystemStats();
        if ((res as any).error) {
            toast.error("Failed to load system stats");
        } else {
            setStats((res as any).data);
        }
        setIsLoading(false);
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Grievances",
            value: stats?.totalGrievances || 0,
            icon: FileText,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            desc: "All time reports"
        },
        {
            title: "Active Users",
            value: stats?.activeUsers || 0,
            icon: Users,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            desc: "Registered citizens & officers"
        },
        {
            title: "Departments",
            value: stats?.departments || 0,
            icon: Building2,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            desc: "Operational units"
        },
        {
            title: "Resolution Rate",
            value: `${stats?.resolutionRate || 0}%`,
            icon: CheckCircle2,
            color: "text-green-500",
            bg: "bg-green-500/10",
            desc: "Grievances resolved"
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Overview</h1>
                <p className="text-slate-500 dark:text-slate-400">System-wide performance metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <GlassPanel key={index} className="p-6 flex items-center gap-4 hover:scale-105 transition-transform duration-200">
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                            <p className="text-xs text-slate-400 mt-1">{stat.desc}</p>
                        </div>
                    </GlassPanel>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <GlassPanel className="p-6 min-h-[300px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-purple-500" />
                            Recent Activity
                        </h3>
                        <span className="text-xs text-slate-400">Real-time</span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {[
                            { user: "Priya Sharma", action: "submitted a grievance", time: "2 mins ago", type: "submit" },
                            { user: "Officer Raj", action: "resolved Ticket #4829", time: "15 mins ago", type: "resolve" },
                            { user: "Amit Patel", action: "registered as Citizen", time: "1 hour ago", type: "register" },
                            { user: "System", action: "automated backup completed", time: "3 hours ago", type: "system" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                                <div className={`w-2 h-2 mt-2 rounded-full ${item.type === 'resolve' ? 'bg-green-500' : item.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                <div>
                                    <p className="text-sm text-slate-300">
                                        <span className="font-semibold text-white">{item.user}</span> {item.action}
                                    </p>
                                    <p className="text-xs text-slate-500">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6 min-h-[300px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            Performance Trends
                        </h3>
                        <span className="text-xs text-slate-400">Last 30 days</span>
                    </div>
                    <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2">
                        {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                            <div key={i} className="w-full bg-blue-500/20 rounded-t-lg relative group">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg transition-all duration-500 group-hover:bg-blue-400"
                                    style={{ height: `${h}%` }}
                                />
                            </div>
                        ))}
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}
