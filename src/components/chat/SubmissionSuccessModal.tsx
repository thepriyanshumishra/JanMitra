import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Clock, Building2, ShieldAlert, X } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface SubmissionSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onChallenge: () => void;
    data: {
        id: string;
        priority: string;
        department: string;
        sla: string;
        summary: string;
    };
}

export function SubmissionSuccessModal({ isOpen, onClose, onChallenge, data }: SubmissionSuccessModalProps) {
    if (!isOpen) return null;

    const getPriorityColor = (p: string) => {
        switch (p?.toLowerCase()) {
            case "high": return "text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
            case "medium": return "text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
            default: return "text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="w-full max-w-md"
                >
                    <GlassPanel className="p-0 relative overflow-hidden flex flex-col">
                        {/* macOS Title Bar */}
                        <div className="h-10 bg-white/50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E]" />
                            <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89E24]" />
                            <div className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29]" />
                        </div>

                        <div className="p-6">
                            {/* Success Header */}
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 shadow-inner">
                                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Grievance Filed</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">ID: #{data.id}</p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {/* Priority Card */}
                                <div className={`p-3 rounded-xl border ${getPriorityColor(data.priority)} flex flex-col items-center justify-center text-center shadow-sm`}>
                                    <ShieldAlert className="w-5 h-5 mb-1 opacity-80" />
                                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Priority</span>
                                    <span className="text-lg font-bold">{data.priority || "Medium"}</span>
                                </div>

                                {/* SLA Card */}
                                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-center shadow-sm">
                                    <Clock className="w-5 h-5 mb-1 text-slate-500 dark:text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Resolution</span>
                                    <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{data.sla || "48 Hrs"}</span>
                                </div>

                                {/* Department Card (Full Width) */}
                                <div className="col-span-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3 shadow-sm">
                                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Assigned Department</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{data.department || "General Administration"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50">
                                <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Summary</h4>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                    {data.summary}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 px-4 rounded-full bg-[#007AFF] text-white font-semibold shadow-lg hover:bg-[#0062CC] transition-all active:scale-95"
                                >
                                    Done
                                </button>

                                <button
                                    onClick={onChallenge}
                                    className="w-full py-3 px-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <AlertTriangle className="w-4 h-4" />
                                    Challenge Priority
                                </button>
                            </div>
                        </div>
                    </GlassPanel>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
