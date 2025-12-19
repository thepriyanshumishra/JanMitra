"use client";

import { useState } from "react";
import Image from "next/image";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Check, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const AVATARS = [
    { id: "citizen_male", src: "/avatars/avatar_citizen_male.png", label: "Citizen (M)" },
    { id: "citizen_female", src: "/avatars/avatar_citizen_female.png", label: "Citizen (F)" },
    { id: "police_male", src: "/avatars/avatar_police_male.png", label: "Police (M)" },
    { id: "police_female", src: "/avatars/avatar_police_female.png", label: "Police (F)" },
    { id: "doctor_male", src: "/avatars/avatar_doctor_male.png", label: "Doctor (M)" },
    { id: "doctor_female", src: "/avatars/avatar_doctor_female.png", label: "Doctor (F)" },
    { id: "student_male", src: "/avatars/avatar_student_male.png", label: "Student (M)" },
    { id: "student_female", src: "/avatars/avatar_student_female.png", label: "Student (F)" },
    { id: "elderly_male", src: "/avatars/avatar_elderly_male.png", label: "Elderly (M)" },
    { id: "elderly_female", src: "/avatars/avatar_elderly_female.png", label: "Elderly (F)" },
    { id: "shopkeeper_male", src: "/avatars/avatar_shopkeeper_male.png", label: "Shopkeeper (M)" },
    { id: "shopkeeper_female", src: "/avatars/avatar_shopkeeper_female.png", label: "Shopkeeper (F)" },
    { id: "tech_male", src: "/avatars/avatar_tech_male.png", label: "Tech (M)" },
    { id: "tech_female", src: "/avatars/avatar_tech_female.png", label: "Tech (F)" },
    { id: "worker_male", src: "/avatars/avatar_worker_male.png", label: "Worker (M)" },
];

interface AvatarSelectorProps {
    currentAvatar?: string;
    onSelect: (avatarUrl: string) => void;
    onClose: () => void;
}

export function AvatarSelector({ currentAvatar, onSelect, onClose }: AvatarSelectorProps) {
    const [selected, setSelected] = useState(currentAvatar);

    const handleSelect = (src: string) => {
        setSelected(src);
        onSelect(src);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
            </div>

            <GlassPanel className="relative w-full max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden border-white/20 dark:border-white/10 shadow-2xl bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl ring-1 ring-white/20">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Choose Your Persona</h2>
                            <p className="text-sm text-slate-300 font-medium">Select a profile picture that represents you</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors group"
                    >
                        <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {AVATARS.map((avatar) => (
                            <button
                                key={avatar.id}
                                onClick={() => handleSelect(avatar.src)}
                                className={cn(
                                    "group relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 outline-none",
                                    selected === avatar.src
                                        ? "ring-4 ring-blue-500 shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)] scale-105 z-10"
                                        : "hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-white/20 hover:z-10"
                                )}
                            >
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 transition-opacity duration-300",
                                    selected === avatar.src ? "opacity-0" : "opacity-100 group-hover:opacity-0"
                                )} />

                                <Image
                                    src={avatar.src}
                                    alt={avatar.label}
                                    fill
                                    className={cn(
                                        "object-cover transition-transform duration-500",
                                        selected === avatar.src ? "scale-110" : "group-hover:scale-110"
                                    )}
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                                    <span className="text-xs font-bold text-white tracking-wide px-2 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                                        {avatar.label}
                                    </span>
                                </div>

                                {selected === avatar.src && (
                                    <div className="absolute top-3 right-3 p-1.5 rounded-full bg-blue-500 text-white shadow-lg animate-in zoom-in duration-200">
                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
}
