"use client";

import { useEffect, useState } from "react";
import { getAllGrievances } from "@/app/actions/admin";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Loader2, Search, Filter, Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExportButton } from "@/components/dashboard/ExportButton";

export default function AdminGrievancesPage() {
    const [grievances, setGrievances] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadGrievances();
    }, [filter]);

    async function loadGrievances() {
        setIsLoading(true);
        const res = await getAllGrievances(filter === "all" ? undefined : filter);
        if (res.error) {
            toast.error("Failed to load grievances");
        } else {
            setGrievances((res as any).data || []);
        }
        setIsLoading(false);
    }

    const filteredGrievances = grievances.filter(g =>
        g.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "resolved": return "bg-green-500/20 text-green-500 border-green-500/50";
            case "rejected": return "bg-red-500/20 text-red-500 border-red-500/50";
            case "in_progress": return "bg-blue-500/20 text-blue-500 border-blue-500/50";
            default: return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Grievances</h1>
                    <p className="text-slate-500 dark:text-slate-400">Master view of all citizen complaints.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search ID or Summary..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-64"
                        />
                    </div>
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                        </SelectContent>
                    </Select>
                    <ExportButton data={filteredGrievances} filename={`grievances-${new Date().toISOString().split('T')[0]}.csv`} />
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
            ) : (
                <GlassPanel className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-3">ID / Date</th>
                                    <th className="px-6 py-3">Summary</th>
                                    <th className="px-6 py-3">Department</th>
                                    <th className="px-6 py-3">Assigned To</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGrievances.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            No grievances found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredGrievances.map((g) => (
                                        <tr key={g.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900 dark:text-white">#{g.id.slice(0, 6)}</div>
                                                <div className="text-xs text-slate-500">{new Date(g.created_at).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate" title={g.summary}>
                                                {g.summary}
                                            </td>
                                            <td className="px-6 py-4">
                                                {g.departments?.name ? (
                                                    <Badge variant="outline" className="border-purple-500/30 text-purple-500">
                                                        {g.departments.name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-slate-400 italic">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {g.assignee?.full_name || <span className="text-slate-400">-</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={getStatusColor(g.status)} variant="outline">
                                                    {g.status.replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link href={`/dashboard/submit/review/${g.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </GlassPanel>
            )}
        </div>
    );
}
