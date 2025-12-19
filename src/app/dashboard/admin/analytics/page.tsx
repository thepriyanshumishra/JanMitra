"use client";

import { useEffect, useState } from "react";
import { getAnalyticsData } from "@/app/actions/admin";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Loader2, TrendingUp, PieChart as PieIcon, BarChart as BarIcon } from "lucide-react";
import { toast } from "sonner";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line
} from "recharts";

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setIsLoading(true);
        const res = await getAnalyticsData();
        if (res.error) {
            toast.error("Failed to load analytics");
        } else {
            setData((res as any).data);
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400">Insights and trends from the grievance system.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Department Distribution */}
                <GlassPanel className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <PieIcon className="w-5 h-5 text-purple-500" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">By Department</h3>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data?.byDepartment}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data?.byDepartment.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </GlassPanel>

                {/* Status Distribution */}
                <GlassPanel className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <BarIcon className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">By Status</h3>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.byStatus}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <RechartsTooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassPanel>

                {/* Submission Trend */}
                <GlassPanel className="p-6 md:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Submission Trend (Last 7 Days)</h3>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data?.trend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ fill: '#10b981', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}
