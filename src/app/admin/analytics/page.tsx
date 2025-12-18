"use client";

import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { supabase } from "@/lib/supabase";
import { BarChart3, TrendingUp, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

export default function AdminAnalyticsPage() {
    const [stats, setStats] = useState({
        total: 0,
        resolved: 0,
        pending: 0,
        inProgress: 0
    });
    const [categoryData, setCategoryData] = useState<any[]>([]);
    const [statusData, setStatusData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setIsLoading(true);

            const { data: grievances, error } = await supabase
                .from("grievances")
                .select("category, status");

            if (error) {
                console.error("Error fetching analytics:", error);
                toast.error("Failed to load analytics");
                setIsLoading(false);
                return;
            }

            if (!grievances) return;

            // Calculate Stats
            const total = grievances.length;
            const resolved = grievances.filter(g => g.status === "resolved").length;
            const pending = grievances.filter(g => g.status === "pending").length;
            const inProgress = grievances.filter(g => g.status === "in_progress").length;

            setStats({ total, resolved, pending, inProgress });

            // Prepare Chart Data
            const categories: Record<string, number> = {};
            grievances.forEach(g => {
                categories[g.category] = (categories[g.category] || 0) + 1;
            });

            setCategoryData(Object.entries(categories).map(([name, value]) => ({ name, value })));

            setStatusData([
                { name: "Resolved", value: resolved, color: "#22c55e" },
                { name: "Pending", value: pending, color: "#f59e0b" },
                { name: "In Progress", value: inProgress, color: "#3b82f6" },
            ]);

            setIsLoading(false);
        };

        fetchAnalytics();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <GlassPanel className="p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white shadow-lg`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
            </div>
        </GlassPanel>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">System Analytics</h1>
                <p className="text-slate-500 dark:text-slate-400">Real-time insights and performance metrics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Grievances"
                    value={stats.total}
                    icon={BarChart3}
                    color="bg-gradient-to-br from-indigo-500 to-purple-600"
                />
                <StatCard
                    title="Resolved"
                    value={stats.resolved}
                    icon={CheckCircle2}
                    color="bg-gradient-to-br from-green-500 to-emerald-600"
                />
                <StatCard
                    title="Pending"
                    value={stats.pending}
                    icon={AlertTriangle}
                    color="bg-gradient-to-br from-amber-500 to-orange-600"
                />
                <StatCard
                    title="In Progress"
                    value={stats.inProgress}
                    icon={Clock}
                    color="bg-gradient-to-br from-blue-500 to-cyan-600"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Chart */}
                <GlassPanel className="p-6 min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Grievances by Category</h3>
                    <div className="flex-1 w-full h-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassPanel>

                {/* Status Chart */}
                <GlassPanel className="p-6 min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Status Distribution</h3>
                    <div className="flex-1 w-full h-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 mt-4">
                            {statusData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}
