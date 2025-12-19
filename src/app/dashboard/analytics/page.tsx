"use client";

import { useEffect, useState } from "react";
import { getAnalyticsData } from "@/app/actions/analytics";
import { GlassPanel } from "@/components/ui/GlassPanel";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, CartesianGrid
} from "recharts";
import { Activity, CheckCircle2, Clock, TrendingUp } from "lucide-react";

type AnalyticsData = {
    categoryData: { name: string; value: number }[];
    sentimentData: { name: string; value: number; color: string }[];
    trendData: { day: string; reports: number; resolved: number }[];
};

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData>({
        categoryData: [],
        sentimentData: [],
        trendData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getAnalyticsData();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const { categoryData, sentimentData, trendData } = data;

    // Calculate Key Metrics
    const totalGrievances = categoryData.reduce((acc, curr) => acc + curr.value, 0);
    const resolvedCount = trendData.reduce((acc, curr) => acc + curr.resolved, 0);
    const resolutionRate = totalGrievances > 0 ? Math.round((resolvedCount / totalGrievances) * 100) : 0;

    return (
        <div className="relative max-w-6xl mx-auto space-y-8 p-4">
            {/* Background Blobs */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                        Governance Analytics
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Data-driven insights from citizen grievances.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 backdrop-blur-md border border-blue-500/20 text-blue-700 dark:text-blue-300 shadow-lg shadow-blue-500/10">
                    <Activity className="w-5 h-5" />
                    <span className="font-bold">Live Data</span>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-96 text-slate-400 animate-pulse">
                    Loading analytics...
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <GlassPanel className="p-6 border-white/30 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Activity className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Reports</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalGrievances}</p>
                            </div>
                        </GlassPanel>

                        <GlassPanel className="p-6 border-white/30 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Resolution Rate</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{resolutionRate}%</p>
                            </div>
                        </GlassPanel>

                        <GlassPanel className="p-6 border-white/30 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                <Clock className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Avg Response</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">24h</p>
                            </div>
                        </GlassPanel>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Category Distribution */}
                        <GlassPanel className="p-6 border-white/30 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                Grievances by Category
                            </h3>
                            <div className="h-[300px] w-full">
                                {categoryData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={categoryData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                            <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40}>
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'][index % 4]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">
                                        No category data available
                                    </div>
                                )}
                            </div>
                        </GlassPanel>

                        {/* Sentiment Analysis */}
                        <GlassPanel className="p-6 border-white/30 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-purple-500" />
                                Public Sentiment
                            </h3>
                            <div className="h-[300px] w-full flex items-center justify-center relative">
                                {sentimentData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={sentimentData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={80}
                                                outerRadius={110}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {sentimentData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">
                                        No sentiment data available
                                    </div>
                                )}
                                {/* Center Text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{totalGrievances}</span>
                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total</span>
                                </div>
                            </div>
                            {sentimentData.length > 0 && (
                                <div className="flex justify-center gap-6 mt-4">
                                    {sentimentData.map((item) => (
                                        <div key={item.name} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </GlassPanel>

                        {/* Resolution Trends */}
                        <GlassPanel className="p-6 border-white/30 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl col-span-1 lg:col-span-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                Resolution Efficiency Trend (Last 7 Days)
                            </h3>
                            <div className="h-[300px] w-full">
                                {trendData.some(d => d.reports > 0 || d.resolved > 0) ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={trendData}>
                                            <defs>
                                                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorReports)" />
                                            <Area type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorResolved)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">
                                        No trend data available yet
                                    </div>
                                )}
                            </div>
                        </GlassPanel>
                    </div>
                </div>
            )}
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 dark:border-white/10 p-4 rounded-xl shadow-xl">
                <p className="font-bold text-slate-900 dark:text-white mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                        <span className="text-slate-500 dark:text-slate-400 capitalize">{entry.name}:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

