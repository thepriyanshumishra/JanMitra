"use client";

import { useRole } from "@/hooks/useRole";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
// We can reuse Sidebar for now or create AdminSidebar
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { role, isLoading } = useRole();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && role !== "admin") {
            router.push("/dashboard");
        }
    }, [role, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        );
    }

    if (role !== "admin") {
        return null;
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
