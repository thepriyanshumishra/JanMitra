"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/app/actions/admin";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Loader2, Search, Shield, User, Briefcase, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserEditModal } from "@/components/dashboard/UserEditModal";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        setIsLoading(true);
        const res = await getAllUsers();
        if (res.error) {
            toast.error("Failed to load users");
        } else {
            setUsers((res as any).data || []);
        }
        setIsLoading(false);
    }

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage roles and permissions.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-64"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {filteredUsers.map((user) => (
                    <GlassPanel key={user.id} className="p-4 flex items-center justify-between group hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12 border-2 border-white dark:border-slate-800 shadow-sm">
                                <AvatarImage src={user.avatar_url} />
                                <AvatarFallback>{user.full_name?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    {user.full_name || "Unknown User"}
                                    {user.role === 'admin' && <Shield className="w-4 h-4 text-red-500" />}
                                    {user.role === 'officer' && <Briefcase className="w-4 h-4 text-blue-500" />}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden md:block text-right">
                                <div className={cn(
                                    "text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full inline-block mb-1",
                                    user.role === 'admin' ? "bg-red-100 text-red-600" :
                                        user.role === 'officer' ? "bg-blue-100 text-blue-600" :
                                            "bg-slate-100 text-slate-600"
                                )}>
                                    {user.role}
                                </div>
                                {user.departments?.name && (
                                    <p className="text-xs text-slate-500">{user.departments.name}</p>
                                )}
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedUser(user)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Edit2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </GlassPanel>
                ))}
            </div>

            {selectedUser && (
                <UserEditModal
                    isOpen={!!selectedUser}
                    onClose={() => setSelectedUser(null)}
                    user={selectedUser}
                    onUpdate={loadUsers}
                />
            )}
        </div>
    );
}
