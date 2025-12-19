"use client";

import { useState } from "react";
import { getGrievanceByTrackingId } from "@/app/actions/draft-grievance";
import { Search, Loader2, MapPin, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { toast } from "sonner";

export default function TrackComplaintPage() {
    const [trackingId, setTrackingId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [grievance, setGrievance] = useState<any>(null);
    const [searched, setSearched] = useState(false);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingId.trim()) return;

        setIsLoading(true);
        setGrievance(null);
        setSearched(true);

        try {
            const data = await getGrievanceByTrackingId(trackingId.trim().toUpperCase());
            if (data) {
                setGrievance(data);
                toast.success("Grievance found!");
            } else {
                toast.error("Grievance not found");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved': return 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900';
            case 'rejected': return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900';
            case 'pending': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900';
            default: return 'text-slate-500 bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'resolved': return CheckCircle;
            case 'rejected': return AlertCircle;
            case 'pending': return Clock;
            default: return FileText;
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Track Complaint</h1>
                <p className="text-slate-500 dark:text-slate-400">Enter your Tracking ID to check the status</p>
            </div>

            <GlassPanel className="p-8">
                <form onSubmit={handleTrack} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                            placeholder="Enter ID (e.g. JM-X7Y2Z9)"
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none font-mono uppercase"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !trackingId}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Track"}
                    </button>
                </form>
            </GlassPanel>

            {searched && !grievance && !isLoading && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">No grievance found</h3>
                    <p className="text-slate-500 dark:text-slate-400">Check the ID and try again</p>
                </div>
            )}

            {grievance && (
                <GlassPanel className="p-6 border-l-4 border-l-blue-500 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Search className="w-32 h-32" />
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Tracking ID</p>
                                <h2 className="text-3xl font-mono font-bold text-slate-900 dark:text-white">{grievance.tracking_id}</h2>
                            </div>
                            <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${getStatusColor(grievance.status)}`}>
                                {(() => {
                                    const Icon = getStatusIcon(grievance.status);
                                    return <Icon className="w-4 h-4" />;
                                })()}
                                <span className="font-bold uppercase text-xs tracking-wider">{grievance.status}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-slate-500 mb-1">Description</h3>
                                <p className="text-slate-900 dark:text-white text-lg">{grievance.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm">{grievance.location || "No location"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm">Submitted: {new Date(grievance.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassPanel>
            )}
        </div>
    );
}

import { FileText } from "lucide-react";
