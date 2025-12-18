"use client";

import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, XCircle, ShieldAlert, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PendingUser {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    avatar_url: string | null;
}

export default function ApprovalsPage() {
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchPendingUsers = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("role", "officer")
            .eq("is_active", false)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching pending users:", error);
            toast.error("Failed to load pending approvals");
        } else {
            setPendingUsers(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const handleApprove = async (userId: string) => {
        setActionLoading(userId);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ is_active: true })
                .eq("id", userId);

            if (error) throw error;

            toast.success("Officer approved successfully");
            setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (error: any) {
            toast.error("Failed to approve user");
            console.error(error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (userId: string) => {
        if (!confirm("Are you sure you want to reject this user? This cannot be undone.")) return;

        setActionLoading(userId);
        try {
            // In a real app, you might want to soft delete or just keep them inactive
            // For now, we'll just keep them inactive but maybe add a 'rejected' flag if we had one
            // Or we could delete the profile/user (requires admin API for auth user deletion)

            // For this demo, we'll just show a toast saying rejected (no action needed if they stay inactive)
            // Or we could update role to 'citizen' to demote them

            const { error } = await supabase
                .from("profiles")
                .update({ role: 'citizen', is_active: true }) // Demote to citizen
                .eq("id", userId);

            if (error) throw error;

            toast.success("User rejected and demoted to Citizen");
            setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (error: any) {
            toast.error("Failed to reject user");
            console.error(error);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pending Approvals</h1>
                    <p className="text-slate-500 dark:text-slate-400">Review and approve officer account requests</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" />
                        {pendingUsers.length} Pending
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
                    ))}
                </div>
            ) : pendingUsers.length === 0 ? (
                <GlassPanel className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">All Caught Up!</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-2">
                        There are no pending officer approvals at the moment.
                    </p>
                </GlassPanel>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingUsers.map((user) => (
                        <GlassPanel key={user.id} className="flex flex-col p-6 relative group hover:border-blue-500/30 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {user.full_name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                                            {user.full_name || "Unknown User"}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Applied {new Date(user.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium border border-purple-200 dark:border-purple-800">
                                    Officer
                                </span>
                            </div>

                            <div className="space-y-3 mb-6 flex-1">
                                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-1">Email</p>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 break-all">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-auto">
                                <button
                                    onClick={() => handleReject(user.id)}
                                    disabled={actionLoading === user.id}
                                    className="flex-1 py-2 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-sm transition-colors disabled:opacity-50"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleApprove(user.id)}
                                    disabled={actionLoading === user.id}
                                    className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-sm shadow-lg shadow-green-500/20 transition-all disabled:opacity-50"
                                >
                                    {actionLoading === user.id ? "Processing..." : "Approve"}
                                </button>
                            </div>
                        </GlassPanel>
                    ))}
                </div>
            )}
        </div>
    );
}
