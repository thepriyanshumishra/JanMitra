"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { Loader2 } from "lucide-react";

export default function DashboardRoot() {
    const { role, isLoading } = useRole();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (role === "admin") {
                router.replace("/dashboard/admin");
            } else if (role === "officer") {
                router.replace("/dashboard/officer");
            } else {
                router.replace("/dashboard/citizen");
            }
        }
    }, [role, isLoading, router]);

    return (
        <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Redirecting to your portal...</p>
            </div>
        </div>
    );
}
