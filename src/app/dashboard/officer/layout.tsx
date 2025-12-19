"use client";

import { useRole } from "@/hooks/useRole";
import { OfficerSidebar } from "@/components/dashboard/OfficerSidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
    const { role, isLoading } = useRole();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && role !== "officer" && role !== "admin") {
            router.push("/dashboard");
        }
    }, [role, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (role !== "officer" && role !== "admin") {
        return null; // Or a 403 Forbidden component
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Sidebar is handled by Root Dashboard Layout */}
            <div className="transition-all duration-300">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </div>
        </div>
    );
}
