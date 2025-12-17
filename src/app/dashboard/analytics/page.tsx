"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

const categoryData = [
    { name: "Water", value: 45 },
    { name: "Electricity", value: 32 },
    { name: "Roads", value: 28 },
    { name: "Sanitation", value: 19 },
    { name: "Law", value: 12 },
];

const sentimentData = [
    { name: "Negative", value: 65, color: "#ef4444" },
    { name: "Neutral", value: 25, color: "#94a3b8" },
    { name: "Positive", value: 10, color: "#22c55e" },
];

const trendData = [
    { day: "Mon", reports: 12, resolved: 10 },
    { day: "Tue", reports: 18, resolved: 14 },
    { day: "Wed", reports: 15, resolved: 16 },
    { day: "Thu", reports: 25, resolved: 20 },
    { day: "Fri", reports: 22, resolved: 18 },
    { day: "Sat", reports: 30, resolved: 24 },
    { day: "Sun", reports: 10, resolved: 8 },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Governance Analytics</h1>
                <p className="text-slate-500 dark:text-slate-400">Data-driven insights from citizen grievances.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Distribution */}
                <GlassPanel className="p-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Grievances by Category</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData}>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: 'none' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassPanel>

                {/* Sentiment Analysis */}
                <GlassPanel className="p-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Public Sentiment</h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sentimentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {sentimentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        {sentimentData.map((item) => (
                            <div key={item.name} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                {item.name}
                            </div>
                        ))}
                    </div>
                </GlassPanel>

                {/* Resolution Trends */}
                <GlassPanel className="p-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 col-span-1 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Resolution Efficiency Trend</h3>
                    <div className="h-[300px] w-full">
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
                                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: 'none' }} />
                                <Area type="monotone" dataKey="reports" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReports)" />
                                <Area type="monotone" dataKey="resolved" stroke="#22c55e" fillOpacity={1} fill="url(#colorResolved)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}
