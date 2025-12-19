"use client";

import { useEffect, useState } from "react";
import { getDepartmentGrievances, updateGrievanceStatus } from "@/app/actions/officer-grievance";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Loader2, MapPin, Calendar, User, ArrowRight, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function DepartmentPage() {
    const { user } = useAuth();
    const [grievances, setGrievances] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unassigned' | 'pending'>('all');

    useEffect(() => {
        loadGrievances();
    }, []);

    async function loadGrievances() {
        setIsLoading(true);
        const res = await getDepartmentGrievances();
        if (res.error) {
            toast.error(res.error);
        } else {
            setGrievances(res.data || []);
        }
        setIsLoading(false);
    }

    async function handleAssignSelf(grievanceId: string) {
        const { assignGrievance } = await import("@/app/actions/officer-grievance");

        toast.promise(assignGrievance(grievanceId), {
            loading: "Assigning to you...",
            success: (data) => {
                if (data.error) throw new Error(data.error);
                loadGrievances(); // Reload list
                return "Grievance assigned successfully!";
            },
            error: (err) => `Assignment failed: ${err.message}`
        });
    }

    const filteredGrievances = grievances.filter(g => {
        if (filter === 'unassigned') return !g.assigned_officer_id;
        if (filter === 'pending') return g.status === 'pending';
        return true;
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Department Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400">Grievances in your jurisdiction.</p>
                </div>
                <div className="flex gap-2">
                    {(['all', 'unassigned', 'pending'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors",
                                filter === f
                                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4">
                {filteredGrievances.map((g) => (
                    <GlassPanel key={g.id} className="p-6 transition-all hover:scale-[1.01] group border-l-4 border-l-transparent hover:border-l-purple-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                        g.priority === 'High' ? "bg-red-500/10 text-red-600 border-red-500/20" :
                                            g.priority === 'Medium' ? "bg-orange-500/10 text-orange-600 border-orange-500/20" :
                                                "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                    )}>
                                        {g.priority}
                                    </span>
                                    {!g.assigned_officer_id && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                                            Unassigned
                                        </span>
                                    )}
                                    {g.assigned_officer_id === user?.id && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/30">
                                            Assigned to You
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {g.category} - {g.location || "No Location"}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                    {g.description || "No description provided."}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
                                    <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        <span>{g.profiles?.full_name || "Anonymous"}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{formatDistanceToNow(new Date(g.created_at), { addSuffix: true })}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3 min-w-[140px]">
                                {!g.assigned_officer_id ? (
                                    <button
                                        onClick={() => handleAssignSelf(g.id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-purple-500/20 w-full justify-center"
                                    >
                                        Pick Up
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <div className="text-xs font-medium text-slate-400 text-center w-full py-2">
                                        Assigned
                                    </div>
                                )}
                            </div>
                        </div>
                    </GlassPanel>
                ))}

                {filteredGrievances.length === 0 && (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        No grievances found matching filter.
                    </div>
                )}
            </div>
        </div>
    );
}
