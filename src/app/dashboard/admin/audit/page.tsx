"use client";

import { useEffect, useState } from "react";
import { getAuditLogs } from "@/app/actions/audit";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadLogs();
    }, []);

    async function loadLogs() {
        setIsLoading(true);
        const res = await getAuditLogs();
        if (res.error) {
            toast.error("Failed to load audit logs");
        } else {
            setLogs(res.data || []);
        }
        setIsLoading(false);
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Audit Logs</h1>
                <p className="text-slate-500 dark:text-slate-400">Track system activities and security events.</p>
            </div>

            <GlassPanel className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-3">Timestamp</th>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Action</th>
                                <th className="px-6 py-3">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                        No logs found.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            {log.profiles?.full_name || "Unknown"}
                                            <div className="text-xs text-slate-400">{log.profiles?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <pre className="text-xs text-slate-500 max-w-xs overflow-hidden text-ellipsis">
                                                {JSON.stringify(log.details)}
                                            </pre>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassPanel>
        </div>
    );
}
