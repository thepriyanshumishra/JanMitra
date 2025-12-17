"use client";

import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { analyzeGrievance, AIAnalysisResult } from "@/lib/ai-engine";
import { Loader2, Send, AlertTriangle, CheckCircle2, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SubmitGrievancePage() {
    const [complaint, setComplaint] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);

    // Debounced Analysis
    useEffect(() => {
        const timer = setTimeout(() => {
            if (complaint.length > 10) {
                setIsAnalyzing(true);
                // Simulate network delay for "AI" feel
                setTimeout(() => {
                    const result = analyzeGrievance(complaint);
                    setAnalysis(result);
                    setIsAnalyzing(false);
                }, 600);
            } else {
                setAnalysis(null);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [complaint]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Input Section */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Submit Grievance</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Describe your issue in detail. Our AI will automatically categorize and prioritize it.
                    </p>
                </div>

                <GlassPanel className="p-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10">
                    <textarea
                        value={complaint}
                        onChange={(e) => setComplaint(e.target.value)}
                        placeholder="e.g., There is a massive water leak on Main Street causing flooding..."
                        className="w-full h-64 bg-transparent border-none resize-none focus:ring-0 text-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    />
                    <div className="flex justify-between items-center mt-4 border-t border-white/20 pt-4">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {complaint.length} characters
                        </span>
                        <button
                            disabled={!analysis || isAnalyzing}
                            onClick={() => {
                                toast.success("Grievance Submitted Successfully", {
                                    description: "Your report ID is #GRV-" + Math.floor(Math.random() * 10000),
                                });
                                setComplaint("");
                                setAnalysis(null);
                            }}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-lg shadow-blue-500/20"
                        >
                            <Send className="w-4 h-4" />
                            Submit Report
                        </button>
                    </div>
                </GlassPanel>
            </div>

            {/* AI Analysis Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <BrainCircuit className="w-6 h-6 text-purple-500 animate-pulse" />
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Live Intelligence Layer</h2>
                </div>

                <GlassPanel className={cn(
                    "p-6 min-h-[400px] transition-all duration-500 border-white/60 dark:border-white/10",
                    analysis ? "bg-white/60 dark:bg-slate-900/60" : "bg-white/20 dark:bg-white/5"
                )}>
                    {!analysis && !isAnalyzing && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-4">
                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center opacity-50">
                                <BrainCircuit className="w-8 h-8" />
                            </div>
                            <p>Waiting for input...</p>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="h-full flex flex-col items-center justify-center text-blue-500 space-y-4">
                            <Loader2 className="w-12 h-12 animate-spin" />
                            <p className="animate-pulse font-medium">Analyzing patterns...</p>
                        </div>
                    )}

                    {analysis && !isAnalyzing && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Priority Badge */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-uppercase tracking-wider text-slate-500 dark:text-slate-400">DETECTED PRIORITY</span>
                                    <div className={cn(
                                        "text-4xl font-black mt-1 tracking-tight",
                                        analysis.priority === "Critical" ? "text-red-600 dark:text-red-500" :
                                            analysis.priority === "High" ? "text-orange-500" :
                                                "text-green-500"
                                    )}>
                                        {analysis.priority.toUpperCase()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-uppercase tracking-wider text-slate-500 dark:text-slate-400">CONFIDENCE</span>
                                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                                        {(analysis.confidence * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <span className="text-xs font-uppercase tracking-wider text-slate-500 dark:text-slate-400">CATEGORY</span>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-200 dark:border-blue-800">
                                        {analysis.category}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium border border-purple-200 dark:border-purple-800">
                                        Sentiment: {analysis.sentiment}
                                    </span>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-2 mb-2 text-slate-900 dark:text-white font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    AI Summary
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    "{analysis.summary}"
                                </p>
                            </div>

                            {/* Action Recommendation */}
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 text-amber-800 dark:text-amber-200">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-medium">
                                    {analysis.priority === "Critical"
                                        ? "Auto-escalation protocols will be triggered immediately upon submission."
                                        : "Standard routing protocols apply. Expected resolution: 24-48 hours."}
                                </p>
                            </div>
                        </div>
                    )}
                </GlassPanel>
            </div>
        </div>
    );
}
