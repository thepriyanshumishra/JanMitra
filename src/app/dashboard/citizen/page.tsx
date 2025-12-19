"use client";

import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Grievance, generateMockGrievance } from "@/lib/mock-data";
import { AlertCircle, CheckCircle2, Clock, MapPin, Activity, Zap, Droplets, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { EscalationTimer } from "@/components/dashboard/EscalationTimer";
import { NewsTicker } from "@/components/dashboard/NewsTicker";
import { GrievanceMap } from "@/components/dashboard/GrievanceMap";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

import { useLanguage } from "@/context/LanguageContext";

export default function DashboardPage() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [grievances, setGrievances] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            const fetchGrievances = async () => {
                const { data, error } = await supabase
                    .from("grievances")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (data) setGrievances(data);
            };
            fetchGrievances();

            // Real-time subscription
            const subscription = supabase
                .channel("grievances")
                .on("postgres_changes", { event: "*", schema: "public", table: "grievances" }, (payload) => {
                    fetchGrievances();
                })
                .subscribe();

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [user]);

    return (
        <div className="space-y-6">
            {/* Ticker Tape */}
            <div className="sticky top-0 z-30 rounded-xl overflow-hidden shadow-2xl shadow-red-900/20 bg-white/5 backdrop-blur-md">
                <NewsTicker />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT COLUMN: Main Feed (8 cols) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Welcome Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {t("welcome_back")}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{user?.user_metadata?.full_name?.split(' ')[0] || "Citizen"}</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">Here's what's happening in your city today.</p>
                    </div>

                    {/* Hero Stats (Bento Row 1) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <BentoStat
                            label={t("city_health")}
                            value="92%"
                            icon={Activity}
                            color="text-green-500"
                            bg="bg-green-500/10"
                            border="border-green-500/20"
                        />
                        <BentoStat
                            label={t("active_alerts")}
                            value="3"
                            icon={ShieldAlert}
                            color="text-red-500"
                            bg="bg-red-500/10"
                            border="border-red-500/20"
                        />
                        <BentoStat
                            label={t("avg_response")}
                            value="14m"
                            icon={Zap}
                            color="text-yellow-500"
                            bg="bg-yellow-500/10"
                            border="border-yellow-500/20"
                        />
                    </div>

                    {/* Live Feed */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                {t("live_feed")}
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {grievances.length === 0 ? (
                                <GlassPanel className="p-8 flex flex-col items-center justify-center text-center space-y-3 bg-white/40 dark:bg-white/5 border-dashed border-2 border-slate-300 dark:border-slate-700">
                                    <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800">
                                        <CheckCircle2 className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">No Recent Activity</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">You haven't submitted any grievances yet.</p>
                                    </div>
                                </GlassPanel>
                            ) : (
                                grievances.map((g, i) => (
                                    <motion.div
                                        key={g.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <GrievanceCard grievance={g} />
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Widgets (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* God View Map */}
                    <div className="h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                        <GrievanceMap />
                    </div>

                    {/* Quick Actions / System Status */}
                    <GlassPanel className="p-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 space-y-4">
                        <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">{t("system_status")}</h3>

                        <div className="space-y-3">
                            <SystemMetric label={t("ai_engine")} status={t("online")} color="text-green-500" />
                            <SystemMetric label={t("polygon_mainnet")} status={t("connected")} color="text-purple-500" />
                            <SystemMetric label={t("database")} status={t("healthy")} color="text-blue-500" />
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
}

function BentoStat({ label, value, icon: Icon, color, bg, border }: any) {
    return (
        <GlassPanel className={cn("p-4 flex items-center gap-4 transition-all hover:scale-[1.02]", bg, border)}>
            <div className={cn("p-3 rounded-xl bg-white/10", color)}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
            </div>
        </GlassPanel>
    );
}

function SystemMetric({ label, status, color }: any) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
            <span className="text-sm font-medium text-slate-400">{label}</span>
            <span className={cn("text-sm font-bold flex items-center gap-2", color)}>
                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse bg-current")} />
                {status}
            </span>
        </div>
    );
}

function GrievanceCard({ grievance }: { grievance: Grievance }) {
    const isCritical = grievance.priority === "Critical";

    return (
        <GlassPanel className={cn(
            "p-4 transition-all duration-300 hover:bg-white/60 dark:hover:bg-white/10 group",
            isCritical
                ? "bg-red-500/5 border-red-500/20"
                : "bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10"
        )}>
            <div className="flex gap-4">
                {/* Icon Box */}
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold",
                    isCritical ? "bg-red-500/20 text-red-500" : "bg-blue-500/10 text-blue-500"
                )}>
                    {grievance.category[0]}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate pr-4">
                            {grievance.summary}
                        </h4>
                        <span className="text-xs text-slate-400 whitespace-nowrap font-mono">
                            {new Date(grievance.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {grievance.location}
                        </span>
                        <span className={cn(
                            "px-1.5 py-0.5 rounded font-bold uppercase",
                            isCritical ? "bg-red-500/20 text-red-500" : "bg-slate-500/10 text-slate-500"
                        )}>
                            {grievance.priority}
                        </span>
                    </div>
                </div>

                {isCritical && (
                    <div className="flex-shrink-0 self-center">
                        <EscalationTimer initialSeconds={45} />
                    </div>
                )}
            </div>
        </GlassPanel>
    );
}
