"use client";

import { useRole } from "@/hooks/useRole";
import { Sidebar } from "./Sidebar";
import { OfficerSidebar } from "./OfficerSidebar";
import { AdminSidebar } from "./AdminSidebar";

export function SidebarWrapper() {
    const { role, isLoading } = useRole();

    if (isLoading) return null; // Or a skeleton sidebar

    if (role === 'admin') {
        return <AdminSidebar />;
    }

    if (role === 'officer') {
        return <OfficerSidebar />;
    }

    // Admin and Citizen use the main Sidebar (which handles Admin links internally)
    return <Sidebar />;
}
