"use client";

import { useEffect, useState } from "react";
import { getDepartments, deleteDepartment } from "@/app/actions/admin";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Loader2, Search, Building2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CreateDepartmentModal } from "@/components/dashboard/CreateDepartmentModal";

export default function AdminDepartmentsPage() {
    const [departments, setDepartments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadDepartments();
    }, []);

    async function loadDepartments() {
        setIsLoading(true);
        const res = await getDepartments();
        if (res.error) {
            toast.error("Failed to load departments");
        } else {
            setDepartments((res as any).data || []);
        }
        setIsLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this department? This action cannot be undone.")) return;

        const res = await deleteDepartment(id);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Department deleted successfully");
            loadDepartments();
        }
    }

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Departments</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage organizational units.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search departments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-64"
                        />
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Department
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredDepartments.map((dept) => (
                    <GlassPanel key={dept.id} className="p-6 flex flex-col justify-between group hover:border-purple-500/30 transition-colors">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-purple-500/10">
                                    <Building2 className="w-6 h-6 text-purple-500" />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(dept.id)}
                                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{dept.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                {dept.description || "No description provided."}
                            </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                            <span>ID: {dept.id.slice(0, 8)}...</span>
                            <span>Active</span>
                        </div>
                    </GlassPanel>
                ))}
            </div>

            <CreateDepartmentModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={loadDepartments}
            />
        </div>
    );
}
