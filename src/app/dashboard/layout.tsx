import { Suspense } from "react";
import { SidebarWrapper } from "@/components/dashboard/SidebarWrapper";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { NotificationBell } from "@/components/ui/NotificationBell";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            <AnimatedBackground />
            <MobileNav />

            {/* Sidebar */}
            <Suspense fallback={<div className="hidden md:flex w-64 h-screen fixed left-0 top-0 bg-slate-50 dark:bg-slate-900 z-40" />}>
                <SidebarWrapper />
            </Suspense>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 overflow-y-auto h-screen relative">
                {/* Top Bar */}
                <div className="absolute top-6 right-8 z-50 flex items-center gap-4">
                    <NotificationBell />
                </div>

                <div className="max-w-7xl mx-auto space-y-8 pt-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
