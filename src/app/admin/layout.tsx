"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { canAccessAdmin, isLoading } = useRole();

    useEffect(() => {
        // Redirect non-admins to dashboard
        if (!isLoading && !canAccessAdmin) {
            router.push("/dashboard");
        }
    }, [canAccessAdmin, isLoading, router]);

    // Show loading or nothing while checking permissions
    if (isLoading || !canAccessAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Verifying permissions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
            <AdminSidebar />
            <main className="flex-1 overflow-auto md:ml-72">
                <div className="container mx-auto p-8">{children}</div>
            </main>
        </div>
    );
}
