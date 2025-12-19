"use client";

import { useEffect, useState } from "react";
import { getAssignedGrievances } from "@/app/actions/officer-grievance";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Loader2, Filter, Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OfficerAssignmentsPage() {
    const [grievances, setGrievances] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        loadGrievances();
    }, []);

    async function loadGrievances() {
        setIsLoading(true);
        const res = await getAssignedGrievances();
        if (res.error) {
            toast.error("Failed to load assignments");
        } else {
            setGrievances(res.data || []);
        }
        setIsLoading(false);
    }

    const filteredGrievances = grievances.filter(g => {
        if (filter === "all") return true;
        return g.status === filter;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Assignments</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage and resolve your assigned grievances.</p>
                </div>
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
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
                                    <th className="px-6 py-3">Citizen</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGrievances.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            No assignments found matching your criteria.
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
                                                {g.profiles?.full_name || "Anonymous"}
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
