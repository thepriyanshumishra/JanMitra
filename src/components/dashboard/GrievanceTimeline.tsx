"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";

interface TimelineEvent {
    status: string;
    timestamp: string;
    note?: string;
}

interface GrievanceTimelineProps {
    history: TimelineEvent[];
    createdAt: string;
}

export function GrievanceTimeline({ history, createdAt }: GrievanceTimelineProps) {
    return (
        <GlassPanel className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Timeline</h3>
            <div className="relative pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-6">
                {history?.map((event, i) => (
                    <div key={i} className="relative">
                        <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${event.status === 'resolved' ? 'bg-green-500' :
                                event.status === 'rejected' ? 'bg-red-500' :
                                    'bg-purple-500'
                            }`} />
                        <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                            {event.status.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-slate-500">
                            {new Date(event.timestamp).toLocaleString()}
                        </p>
                        {event.note && (
                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded">
                                {event.note}
                            </p>
                        )}
                    </div>
                ))}
                <div className="relative">
                    <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-slate-900" />
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Created</p>
                    <p className="text-xs text-slate-500">
                        {new Date(createdAt).toLocaleString()}
                    </p>
                </div>
            </div>
        </GlassPanel>
    );
}
