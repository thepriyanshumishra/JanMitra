"use client";

import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { supabase } from "@/lib/supabase";
import { Users, Search, Filter, Edit2, CheckCircle2, XCircle, Shield, User, BadgeCheck } from "lucide-react";
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

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    role: "citizen" | "officer" | "admin";
    department_id: string | null;
    is_active: boolean;
    created_at: string;
    departments?: { name: string }; // Joined data
}

interface Department {
    id: string;
    name: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");

    // Edit Modal State
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [editRole, setEditRole] = useState<string>("");
    const [editDept, setEditDept] = useState<string>("");
    const [editActive, setEditActive] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);

        // Fetch Users
        const { data: userData, error: userError } = await supabase
            .from("profiles")
            .select(`
                *,
                departments (name)
            `)
            .order("created_at", { ascending: false });

        if (userError) {
            console.error("Error fetching users:", userError);
            toast.error("Failed to load users");
        } else {
            setUsers(userData as any || []);
        }

        // Fetch Departments for dropdown
        const { data: deptData } = await supabase
            .from("departments")
            .select("id, name")
            .order("name");

        if (deptData) setDepartments(deptData);

        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditClick = (user: UserProfile) => {
        setEditingUser(user);
        setEditRole(user.role);
        setEditDept(user.department_id || "");
        setEditActive(user.is_active);
    };

    const handleSaveUser = async () => {
        if (!editingUser) return;
        setIsSaving(true);

        try {
            const updates: any = {
                role: editRole,
                is_active: editActive,
                department_id: editRole === "officer" ? (editDept || null) : null // Only officers need depts
            };

            const { error } = await supabase
                .from("profiles")
                .update(updates)
                .eq("id", editingUser.id);

            if (error) throw error;

            toast.success("User updated successfully");
            setEditingUser(null);
            fetchData(); // Refresh list
        } catch (error: any) {
            toast.error(error.message || "Failed to update user");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage roles, departments, and access</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition-all backdrop-blur-sm"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {["all", "citizen", "officer", "admin"].map((role) => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap",
                                roleFilter === role
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                    : "bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800"
                            )}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <GlassPanel className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">Loading users...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                                                    {user.full_name?.[0]?.toUpperCase() || "U"}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">{user.full_name || "Unknown"}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-xs font-medium border capitalize flex items-center gap-1 w-fit",
                                                user.role === "admin" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" :
                                                    user.role === "officer" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800" :
                                                        "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                            )}>
                                                {user.role === "admin" && <Shield className="w-3 h-3" />}
                                                {user.role === "officer" && <BadgeCheck className="w-3 h-3" />}
                                                {user.role === "citizen" && <User className="w-3 h-3" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {user.departments?.name ? (
                                                <span className="text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                                    {user.departments.name}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">None</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {user.is_active ? (
                                                <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                                                    <CheckCircle2 className="w-3 h-3" /> Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                                                    <XCircle className="w-3 h-3" /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-blue-600 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassPanel>

            {/* Edit User Modal */}
            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent className="sm:max-w-[425px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/20">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update role, department, and status for {editingUser?.full_name}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                            <select
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="citizen">Citizen</option>
                                <option value="officer">Officer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {editRole === "officer" && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Department</label>
                                <select
                                    value={editDept}
                                    onChange={(e) => setEditDept(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Status</span>
                            <button
                                onClick={() => setEditActive(!editActive)}
                                className={cn(
                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                    editActive ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"
                                )}
                            >
                                <span
                                    className={cn(
                                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                        editActive ? "translate-x-6" : "translate-x-1"
                                    )}
                                />
                            </button>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                                Cancel
                            </button>
                        </DialogClose>
                        <button
                            onClick={handleSaveUser}
                            disabled={isSaving}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
