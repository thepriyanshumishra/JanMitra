"use client";

import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/hooks/useRole";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DebugAuthPage() {
    const { user, profile, session, isLoading, signOut } = useAuth();
    const role = useRole();
    const router = useRouter();

    const handleRefresh = () => {
        router.refresh();
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Auth Debug Page</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Check your authentication state and profile data</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh Page
                    </button>
                    <button
                        onClick={signOut}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Sign Out & Re-login
                    </button>
                </div>

                <GlassPanel className="p-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Auth State</h2>
                    <div className="space-y-2 font-mono text-sm">
                        <div>
                            <span className="text-slate-600 dark:text-slate-400">isLoading:</span>{" "}
                            <span className="text-blue-600 dark:text-blue-400">{isLoading ? "true" : "false"}</span>
                        </div>
                        <div>
                            <span className="text-slate-600 dark:text-slate-400">user exists:</span>{" "}
                            <span className="text-blue-600 dark:text-blue-400">{user ? "true" : "false"}</span>
                        </div>
                        <div>
                            <span className="text-slate-600 dark:text-slate-400">session exists:</span>{" "}
                            <span className="text-blue-600 dark:text-blue-400">{session ? "true" : "false"}</span>
                        </div>
                        <div>
                            <span className="text-slate-600 dark:text-slate-400">profile exists:</span>{" "}
                            <span className="text-blue-600 dark:text-blue-400">{profile ? "true" : "false"}</span>
                        </div>
                    </div>
                </GlassPanel>

                {user && (
                    <GlassPanel className="p-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">User Object</h2>
                        <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-auto text-xs">
                            {JSON.stringify(user, null, 2)}
                        </pre>
                    </GlassPanel>
                )}

                {profile && (
                    <GlassPanel className="p-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Profile Object</h2>
                        <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-auto text-xs">
                            {JSON.stringify(profile, null, 2)}
                        </pre>
                    </GlassPanel>
                )}

                <GlassPanel className="p-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Role Hook Data</h2>
                    <div className="space-y-2 font-mono text-sm">
                        <div>
                            <span className="text-slate-600 dark:text-slate-400">role:</span>{" "}
                            <span className={`font-bold ${role.role === 'admin' ? 'text-red-600' : 'text-blue-600'}`}>
                                {role.role}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-600 dark:text-slate-400">isAdmin:</span>{" "}
                            <span className="text-blue-600 dark:text-blue-400">{role.isAdmin ? "true" : "false"}</span>
                        </div>
                        <div>
                            <span className="text-slate-600 dark:text-slate-400">isOfficer:</span>{" "}
                            <span className="text-blue-600 dark:text-blue-400">{role.isOfficer ? "true" : "false"}</span>
                        </div>
                        <div>
                            <span className="text-slate-600 dark:text-slate-400">isCitizen:</span>{" "}
                            <span className="text-blue-600 dark:text-blue-400">{role.isCitizen ? "true" : "false"}</span>
                        </div>
                        <div>
                            <span className="text-slate-600 dark:text-slate-400">canAccessAdmin:</span>{" "}
                            <span className="text-blue-600 dark:text-blue-400">{role.canAccessAdmin ? "true" : "false"}</span>
                        </div>
                        <div>
                            <span className="text-slate-600 dark:text-slate-400">canAccessOfficer:</span>{" "}
                            <span className="text-blue-600 dark:text-blue-400">{role.canAccessOfficer ? "true" : "false"}</span>
                        </div>
                        <div>
                            <span className="text-slate-600 dark:text-slate-400">departmentId:</span>{" "}
                            <span className="text-blue-600 dark:text-blue-400">{role.departmentId || "null"}</span>
                        </div>
                        <div>
                            <span className="text-slate-600 dark:text-slate-400">isActive:</span>{" "}
                            <span className="text-blue-600 dark:text-blue-400">{role.isActive ? "true" : "false"}</span>
                        </div>
                    </div>
                </GlassPanel>

                {!profile && !isLoading && (
                    <GlassPanel className="p-6 bg-red-500/10 border-red-500/20">
                        <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ Profile Not Found</h2>
                        <p className="text-slate-700 dark:text-slate-300">
                            Your profile could not be loaded from the database. This might mean:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 dark:text-slate-400">
                            <li>The profile trigger didn't run when you signed up</li>
                            <li>There's an RLS policy blocking the query</li>
                            <li>The profile table doesn't have a row for your user ID</li>
                        </ul>
                        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                            Try signing out and signing back in. If that doesn't work, check the Supabase logs.
                        </p>
                    </GlassPanel>
                )}

                {role.role === "admin" && (
                    <GlassPanel className="p-6 bg-green-500/10 border-green-500/20">
                        <h2 className="text-xl font-bold text-green-600 mb-4">✓ You are an Admin!</h2>
                        <p className="text-slate-700 dark:text-slate-300">
                            You should be able to access <a href="/admin" className="text-blue-600 hover:underline">/admin</a>
                        </p>
                    </GlassPanel>
                )}
            </div>
        </div>
    );
}
