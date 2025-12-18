import { useAuth, UserRole } from "@/context/AuthContext";

export function useRole() {
    const { profile, isLoading } = useAuth();

    const role: UserRole = profile?.role ?? "citizen";
    const departmentId = profile?.department_id ?? null;
    const isActive = profile?.is_active ?? false;

    // Helper functions
    const isAdmin = role === "admin";
    const isOfficer = role === "officer";
    const isCitizen = role === "citizen";

    // Check if user has access to admin routes
    const canAccessAdmin = isAdmin;

    // Check if user has access to officer routes
    const canAccessOfficer = isOfficer || isAdmin;

    // Check if user can update a specific grievance
    const canUpdateGrievance = (grievanceDepartmentId: string | null) => {
        if (isAdmin) return true;
        if (isOfficer && departmentId === grievanceDepartmentId) return true;
        return false;
    };

    return {
        role,
        departmentId,
        isActive,
        isAdmin,
        isOfficer,
        isCitizen,
        canAccessAdmin,
        canAccessOfficer,
        canUpdateGrievance,
        isLoading,
    };
}
