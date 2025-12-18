"use client";

import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { supabase } from "@/lib/supabase";
import { Building2, Plus, Trash2, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";

interface Department {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
}

export default function AdminDepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newDeptName, setNewDeptName] = useState("");
    const [newDeptDesc, setNewDeptDesc] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchDepartments = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("departments")
            .select("*")
            .order("name", { ascending: true });

        if (error) {
            console.error("Error fetching departments:", error);
            toast.error("Failed to load departments");
        } else {
            setDepartments(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleAddDepartment = async () => {
        if (!newDeptName.trim()) return;
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from("departments")
                .insert([{ name: newDeptName, description: newDeptDesc }]);

            if (error) throw error;

            toast.success("Department added successfully");
            setIsAddOpen(false);
            setNewDeptName("");
            setNewDeptDesc("");
            fetchDepartments();
        } catch (error: any) {
            toast.error(error.message || "Failed to add department");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteDepartment = async (id: string) => {
        if (!confirm("Are you sure? This action cannot be undone.")) return;

        try {
            const { error } = await supabase
                .from("departments")
                .delete()
                .eq("id", id);

            if (error) throw error;

            toast.success("Department deleted");
            setDepartments(prev => prev.filter(d => d.id !== id));
        } catch (error: any) {
            toast.error("Failed to delete department. It might be assigned to users or grievances.");
        }
    };

    const filteredDepartments = departments.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Departments</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage civic bodies and organizations</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-medium">
                            <Plus className="w-5 h-5" />
                            Add Department
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/20">
                        <DialogHeader>
                            <DialogTitle>Add New Department</DialogTitle>
                            <DialogDescription>
                                Create a new department to handle specific types of grievances.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                                <input
                                    value={newDeptName}
                                    onChange={(e) => setNewDeptName(e.target.value)}
                                    placeholder="e.g. Public Works Department"
                                    className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                                <textarea
                                    value={newDeptDesc}
                                    onChange={(e) => setNewDeptDesc(e.target.value)}
                                    placeholder="Brief description of responsibilities..."
                                    className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                                    Cancel
                                </button>
                            </DialogClose>
                            <button
                                onClick={handleAddDepartment}
                                disabled={!newDeptName.trim() || isSubmitting}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                            >
                                {isSubmitting ? "Creating..." : "Create Department"}
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search departments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all backdrop-blur-sm"
                />
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
                    ))}
                </div>
            ) : filteredDepartments.length === 0 ? (
                <GlassPanel className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <Building2 className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No Departments Found</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-2">
                        Try adjusting your search or add a new department.
                    </p>
                </GlassPanel>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDepartments.map((dept) => (
                        <GlassPanel key={dept.id} className="p-6 flex flex-col group hover:border-blue-500/30 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <button
                                    onClick={() => handleDeleteDepartment(dept.id)}
                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Department"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{dept.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 flex-1">
                                {dept.description || "No description provided."}
                            </p>
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                <span>ID: {dept.id.slice(0, 8)}...</span>
                                <span>{new Date(dept.created_at).toLocaleDateString()}</span>
                            </div>
                        </GlassPanel>
                    ))}
                </div>
            )}
        </div>
    );
}
