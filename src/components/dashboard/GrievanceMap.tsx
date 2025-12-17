"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function GrievanceMap() {
    // Simulated hotspots
    const hotspots = [
        { x: "20%", y: "30%", color: "bg-red-500" },
        { x: "50%", y: "50%", color: "bg-blue-500" },
        { x: "70%", y: "20%", color: "bg-orange-500" },
        { x: "80%", y: "80%", color: "bg-green-500" },
        { x: "30%", y: "70%", color: "bg-purple-500" },
    ];

    return (
        <GlassPanel className="relative w-full h-full min-h-[300px] bg-slate-900/50 border-white/10 overflow-hidden group">
            {/* Map Grid Background */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Radar Scan Effect */}
            <motion.div
                className="absolute inset-0 border-b-2 border-blue-500/30 bg-gradient-to-b from-blue-500/0 to-blue-500/10"
                animate={{ top: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            />

            {/* Hotspots */}
            {hotspots.map((spot, i) => (
                <div
                    key={i}
                    className="absolute w-3 h-3 -ml-1.5 -mt-1.5"
                    style={{ left: spot.x, top: spot.y }}
                >
                    <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${spot.color}`} />
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${spot.color}`} />
                </div>
            ))}

            {/* Overlay UI */}
            <div className="absolute top-4 left-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sector Map</h3>
                <div className="text-2xl font-black text-white tracking-tighter">GOD VIEW</div>
            </div>

            <div className="absolute bottom-4 right-4 flex flex-col gap-2 items-end">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-red-500" /> Critical
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-blue-500" /> Water
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-orange-500" /> Power
                </div>
            </div>
        </GlassPanel>
    );
}
