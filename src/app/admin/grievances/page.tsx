"use client";

import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { supabase } from "@/lib/supabase";
import { FileText, Search, Filter, Eye, MapPin, Calendar, User, Building2, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";

interface Grievance {
    id: string;
    summary: string;
    category: string;
    priority: string;
    status: string;
    location: string;
    created_at: string;
    department_id: string | null;
    assigned_officer_id: string | null;
    profiles: { full_name: string; email: string }; // Reporter
    departments?: { name: string };
    assigned_officer?: { full_name: string }; // Joined manually or via view
}

interface Department {
    id: string;
    name: string;
}

interface Officer {
    id: string;
    full_name: string;
}

export default function AdminGrievancesPage() {
    const [grievances, setGrievances] = useState<Grievance[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Detail Modal State
    const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
    const [assignDept, setAssignDept] = useState("");
    const [assignOfficer, setAssignOfficer] = useState("");
    const [updateStatus, setUpdateStatus] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);

        // Fetch Grievances
        // Note: Supabase join syntax depends on foreign key names. 
        // Assuming 'profiles' is linked via user_id, 'departments' via department_id
        // We need to fetch assigned officer name too.

        const { data, error } = await supabase
            .from("grievances")
            .select(`
                *,
                profiles:user_id (full_name, email),
                departments (name)
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching grievances:", error);
            toast.error("Failed to load grievances");
        } else {
            // Manually fetch assigned officer names if needed or use a view
            // For now, let's just use what we have. 
            // If we need officer names, we might need a separate query or better join if relation exists
            setGrievances(data as any || []);
        }

        // Fetch Departments
        const { data: deptData } = await supabase.from("departments").select("id, name").order("name");
        if (deptData) setDepartments(deptData);

        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch officers when department changes in modal
    useEffect(() => {
        if (assignDept) {
            const fetchOfficers = async () => {
                const { data } = await supabase
                    .from("profiles")
                    .select("id, full_name")
                    .eq("role", "officer")
                    .eq("department_id", assignDept)
                    .eq("is_active", true);
                setOfficers(data || []);
            };
            fetchOfficers();
        } else {
            setOfficers([]);
        }
    }, [assignDept]);

    const handleViewClick = (g: Grievance) => {
        setSelectedGrievance(g);
        setAssignDept(g.department_id || "");
        setAssignOfficer(g.assigned_officer_id || "");
        setUpdateStatus(g.status);
    };

    const handleSave = async () => {
        if (!selectedGrievance) return;
        setIsSaving(true);

        try {
            const updates = {
                department_id: assignDept || null,
                assigned_officer_id: assignOfficer || null,
                status: updateStatus
            };

            const { error } = await supabase
                .from("grievances")
                .update(updates)
                .eq("id", selectedGrievance.id);

            if (error) throw error;

            toast.success("Grievance updated");
            setSelectedGrievance(null);
            fetchData();
        } catch (error: any) {
            toast.error("Failed to update grievance");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredGrievances = grievances.filter(g => {
        const matchesSearch = g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || g.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "resolved": return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
            case "in_progress": return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
            case "rejected": return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Grievances</h1>
                    <p className="text-slate-500 dark:text-slate-400">Monitor and assign citizen complaints</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search ID or summary..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all backdrop-blur-sm"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {["all", "pending", "in_progress", "resolved", "rejected"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap",
                                statusFilter === status
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                    : "bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800"
                            )}
                        >
                            {status.replace("_", " ")}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grievances Table */}
            <GlassPanel className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID & Date</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Summary</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">Loading grievances...</td>
                                </tr>
                            ) : filteredGrievances.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">No grievances found.</td>
                                </tr>
                            ) : (
                                filteredGrievances.map((g) => (
                                    <tr key={g.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-xs font-bold text-slate-500">#{g.id.slice(0, 6)}</span>
                                                <span className="text-xs text-slate-400">{new Date(g.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            <p className="font-medium text-slate-900 dark:text-white truncate">{g.summary}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={cn(
                                                    "text-[10px] px-1.5 py-0.5 rounded border uppercase font-bold",
                                                    g.priority === "High" ? "bg-red-50 text-red-600 border-red-200" :
                                                        g.priority === "Medium" ? "bg-amber-50 text-amber-600 border-amber-200" :
                                                            "bg-green-50 text-green-600 border-green-200"
                                                )}>
                                                    {g.priority}
                                                </span>
                                                <span className="text-xs text-slate-500">{g.category}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {g.departments?.name ? (
                                                <span className="text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                                    {g.departments.name}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-xs font-medium border capitalize",
                                                getStatusColor(g.status)
                                            )}>
                                                {g.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleViewClick(g)}
                                                className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-blue-600 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassPanel>

            {/* Detail Modal */}
            <Dialog open={!!selectedGrievance} onOpenChange={(open) => !open && setSelectedGrievance(null)}>
                <DialogContent className="sm:max-w-[600px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/20 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Grievance Details</DialogTitle>
                        <DialogDescription>
                            ID: #{selectedGrievance?.id} • Reported by {selectedGrievance?.profiles?.full_name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Summary & Meta */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{selectedGrievance?.summary}</h3>
                            <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {selectedGrievance?.location || "No location provided"}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {selectedGrievance && new Date(selectedGrievance.created_at).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Assignment Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Department</label>
                                <select
                                    value={assignDept}
                                    onChange={(e) => setAssignDept(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Unassigned</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned Officer</label>
                                <select
                                    value={assignOfficer}
                                    onChange={(e) => setAssignOfficer(e.target.value)}
                                    disabled={!assignDept}
                                    className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                                >
                                    <option value="">Unassigned</option>
                                    {officers.map(o => (
                                        <option key={o.id} value={o.id}>{o.full_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                            <select
                                value={updateStatus}
                                onChange={(e) => setUpdateStatus(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                                Cancel
                            </button>
                        </DialogClose>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            {isSaving ? "Updating..." : "Update Grievance"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
