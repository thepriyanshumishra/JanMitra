"use client";

import { useEffect, useState } from "react";
import { getSubmissions } from "@/app/actions/draft-grievance";
import { ShieldCheck, Clock, CheckCircle2, AlertCircle, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

export default function MySubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getSubmissions().then((data) => {
            setSubmissions(data);
            setIsLoading(false);
        });
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-200';
            case 'in_progress': return 'bg-blue-500/10 text-blue-600 border-blue-200';
            case 'resolved': return 'bg-green-500/10 text-green-600 border-green-200';
            case 'rejected': return 'bg-red-500/10 text-red-600 border-red-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return Clock;
            case 'in_progress': return ShieldCheck;
            case 'resolved': return CheckCircle2;
            case 'rejected': return AlertCircle;
            default: return Clock;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Submissions (Orders)</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track the status of your reports</p>
                </div>
            </div>

            {submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">No submissions yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Once you submit a draft, it will appear here</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {submissions.map((item) => {
                        const StatusIcon = getStatusIcon(item.status);
                        return (
                            <div key={item.id} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${getStatusColor(item.status)}`}>
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            {item.status.replace('_', ' ')}
                                        </span>
                                        <span className="font-mono text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                            {item.tracking_id ? item.tracking_id : `ID: ${item.id.slice(0, 8)}`}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                        {item.description || "Untitled Grievance"}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span>{item.category}</span>
                                        {item.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {item.location}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 min-w-[150px]">
                                    <span className="text-xs font-medium text-slate-400">
                                        Submitted on {new Date(item.submitted_at).toLocaleDateString()}
                                    </span>
                                    {/* Placeholder for "Track" button if we add detailed tracking page later */}
                                    <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
