"use client";

import { useEffect, useState } from "react";
import { getOfficerStats, getAssignedGrievances } from "@/app/actions/officer-grievance";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Loader2, CheckCircle2, Clock, AlertCircle, Briefcase } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function OfficerDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [recent, setRecent] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        setIsLoading(true);
        const [statsRes, recentRes] = await Promise.all([
            getOfficerStats(),
            getAssignedGrievances()
        ]);

        if (statsRes.error) toast.error("Failed to load stats");
        else setStats(statsRes.data);

        if (recentRes.error) toast.error("Failed to load assignments");
        else setRecent(recentRes.data?.slice(0, 5) || []);

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
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Officer</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400">Overview of your assignments and department status.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    icon={Briefcase}
                    label="Total Assigned"
                    value={stats?.assignedTotal}
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                />
                <StatCard
                    icon={Clock}
                    label="My Pending"
                    value={stats?.assignedPending}
                    color="text-yellow-500"
                    bg="bg-yellow-500/10"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Resolved by Me"
                    value={stats?.assignedResolved}
                    color="text-green-500"
                    bg="bg-green-500/10"
                />
                <StatCard
                    icon={AlertCircle}
                    label="Dept. Unassigned"
                    value={stats?.deptPending}
                    color="text-red-500"
                    bg="bg-red-500/10"
                />
            </div>

            {/* Recent Assignments */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Assignments</h2>
                    <Link href="/dashboard/officer/assignments">
                        <Button variant="ghost" size="sm">View All</Button>
                    </Link>
                </div>

                <GlassPanel className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-3">ID / Date</th>
                                    <th className="px-6 py-3">Summary</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                            No assignments found.
                                        </td>
                                    </tr>
                                ) : (
                                    recent.map((g) => (
                                        <tr key={g.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900 dark:text-white">#{g.id.slice(0, 6)}</div>
                                                <div className="text-xs text-slate-500">{new Date(g.created_at).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate" title={g.summary}>
                                                {g.summary}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={
                                                    g.status === 'resolved' ? 'border-green-500/30 text-green-500' :
                                                        g.status === 'rejected' ? 'border-red-500/30 text-red-500' :
                                                            'border-yellow-500/30 text-yellow-500'
                                                }>
                                                    {g.status.replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link href={`/dashboard/officer/grievances/${g.id}`}>
                                                    <Button size="sm" variant="outline">Manage</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color, bg }: any) {
    return (
        <GlassPanel className="p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${bg} ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            </div>
        </GlassPanel>
    );
}
