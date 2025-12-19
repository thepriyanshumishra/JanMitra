import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Clock, Building2, ShieldAlert, FileText, ArrowRight, X, Share2 } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface SubmissionSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDismiss: () => void;
    onChallenge: () => void;
    data: {
        id: string;
        priority: string;
        department: string;
        sla: string;
        summary: string;
    };
}

export function SubmissionSuccessModal({ isOpen, onClose, onDismiss, onChallenge, data }: SubmissionSuccessModalProps) {
    if (!isOpen) return null;

    const getPriorityColor = (p: string) => {
        switch (p?.toLowerCase()) {
            case "high": return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800";
            case "medium": return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800";
            default: return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800";
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="w-full max-w-md relative"
                >
                    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700">
                        {/* Decorative Background Gradient */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/20 pointer-events-none" />

                        {/* Header Actions */}
                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                            <button
                                onClick={onDismiss}
                                className="p-2 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 text-slate-500 dark:text-slate-400 rounded-full transition-colors backdrop-blur-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 relative z-10 pt-10">
                            {/* Success Header */}
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mb-4 shadow-sm ring-4 ring-green-50 dark:ring-green-900/20">
                                    <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">Grievance Filed</h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs mt-2 border border-slate-200 dark:border-slate-700">
                                    ID: #{data.id.slice(0, 8)}...
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {/* Priority Card */}
                                <div className={`p-4 rounded-2xl border ${getPriorityColor(data.priority)} flex flex-col items-center justify-center text-center shadow-sm transition-transform hover:scale-[1.02]`}>
                                    <ShieldAlert className="w-6 h-6 mb-2 opacity-80" />
                                    <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1">Priority</span>
                                    <span className="text-xl font-bold tracking-tight">{data.priority || "Medium"}</span>
                                </div>

                                {/* SLA Card */}
                                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-center shadow-sm transition-transform hover:scale-[1.02]">
                                    <Clock className="w-6 h-6 mb-2 text-blue-500 dark:text-blue-400" />
                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Resolution</span>
                                    <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{data.sla || "48 Hrs"}</span>
                                </div>

                                {/* Department Card (Full Width) */}
                                <div className="col-span-2 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-4 shadow-sm transition-transform hover:scale-[1.01]">
                                    <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-0.5">Assigned Department</span>
                                        <span className="text-base font-bold text-slate-900 dark:text-white">{data.department || "General Administration"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="mb-8 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <FileText className="w-3 h-3" />
                                    AI Summary
                                </h4>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                    {data.summary}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                                >
                                    <FileText className="w-5 h-5" />
                                    Save to Drafts
                                    <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={onChallenge}
                                    className="w-full py-4 px-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                                >
                                    <AlertTriangle className="w-5 h-5" />
                                    Challenge Priority
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
