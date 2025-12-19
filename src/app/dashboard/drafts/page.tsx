"use client";

import { useEffect, useState } from "react";
import { getDrafts, deleteDraft } from "@/app/actions/draft-grievance";
import { FileText, ArrowRight, Calendar, MapPin, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export default function MyDraftsPage() {
    const { t } = useLanguage();
    const [drafts, setDrafts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getDrafts().then((data) => {
            setDrafts(data);
            setIsLoading(false);
        });
    }, []);

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
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Drafts (Cart)</h1>
                    <p className="text-slate-500 dark:text-slate-400">Continue where you left off</p>
                </div>
                <Link href="/dashboard/submit">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        New Grievance
                    </button>
                </Link>
            </div>

            {drafts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Your cart is empty</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Start a chat to create a new draft</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drafts.map((draft) => (
                        <div key={draft.id} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 hover:border-blue-500/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-5 h-5 text-blue-500 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                            </div>

                            <div className="flex items-start justify-between mb-4">
                                <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                                    {draft.category || "General"}
                                </span>
                                {draft.tracking_id && (
                                    <span className="font-mono text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                        {draft.tracking_id}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                                {draft.description || "Untitled Draft"}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-6 h-10">
                                {draft.extracted_data?.summary || "No description provided yet..."}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(draft.updated_at).toLocaleDateString()}
                                </div>
                                {draft.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span className="truncate max-w-[100px]">{draft.location}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Link href={`/dashboard/submit/review/${draft.id}`} className="flex-1">
                                    <button className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                        View Details / Checkout
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                                <button
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        if (confirm("Are you sure you want to delete this draft?")) {
                                            const res = await deleteDraft(draft.id);
                                            if (res.success) {
                                                setDrafts(prev => prev.filter(d => d.id !== draft.id));
                                                toast.success("Draft deleted");
                                            } else {
                                                toast.error("Failed to delete draft");
                                            }
                                        }
                                    }}
                                    className="p-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
