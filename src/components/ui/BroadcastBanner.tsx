"use client";

import { useEffect, useState } from "react";
import { getActiveBroadcast } from "@/app/actions/broadcast";
import { X, Info, AlertTriangle, AlertCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export function BroadcastBanner() {
    const [broadcast, setBroadcast] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        // Don't show on admin dashboard to avoid clutter, or maybe show it so they know it's active?
        // Let's show it everywhere for now.
        loadBroadcast();
    }, [pathname]);

    async function loadBroadcast() {
        const res = await getActiveBroadcast();
        if (res.data) {
            setBroadcast(res.data);
            setIsVisible(true);
        }
    }

    if (!broadcast || !isVisible) return null;

    const styles = {
        info: "bg-blue-600 text-white",
        warning: "bg-yellow-500 text-black",
        error: "bg-red-600 text-white"
    };

    const icons = {
        info: Info,
        warning: AlertTriangle,
        error: AlertCircle
    };

    const Icon = icons[broadcast.type as keyof typeof icons] || Info;

    return (
        <div className={`${styles[broadcast.type as keyof typeof styles]} px-4 py-2 relative z-50`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="w-4 h-4" />
                    <span>{broadcast.message}</span>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
