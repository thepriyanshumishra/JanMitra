"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Helper to get Supabase client with admin check
async function getAdminClient() {
    const cookieStore = await cookies();

    // 1. Standard Client (for Auth check)
    const standardSupabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll() { },
            },
        }
    );

    const { data: { user } } = await standardSupabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // 2. Verify Admin Role (using standard client, assuming "view own profile" works)
    const { data: profile } = await standardSupabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') return { error: "Forbidden: Admin access required" };

    // 3. Create Service Role Client (Bypass RLS)
    // Note: We use the createClient from @supabase/supabase-js for the service role
    // because createServerClient is for SSR/Cookies.
    const { createClient } = require('@supabase/supabase-js');
    const serviceSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    return { supabase: serviceSupabase, user };
}

// --- DASHBOARD STATS ---
export async function getSystemStats() {
    const client = await getAdminClient();
    if ('error' in client) return client;
    const { supabase } = client;

    // Parallel fetch for performance
    const [
        { count: totalGrievances },
        { count: activeUsers },
        { count: departments },
        { count: resolvedGrievances }
    ] = await Promise.all([
        supabase.from('grievances').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('departments').select('*', { count: 'exact', head: true }),
        supabase.from('grievances').select('*', { count: 'exact', head: true }).eq('status', 'resolved')
    ]);

    // Calculate resolution rate
    const resolutionRate = totalGrievances ? ((resolvedGrievances || 0) / totalGrievances) * 100 : 0;

    return {
        data: {
            totalGrievances: totalGrievances || 0,
            activeUsers: activeUsers || 0,
            departments: departments || 0,
            resolutionRate: resolutionRate.toFixed(1)
        }
    };
}

// --- USER MANAGEMENT ---
export async function getAllUsers() {
    const client = await getAdminClient();
    if ('error' in client) return client;
    const { supabase } = client;

    const { data, error } = await supabase
        .from('profiles')
        .select(`
            *,
            departments:department_id (name)
        `)
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { data };
}

export async function updateUserRole(userId: string, role: 'citizen' | 'officer' | 'admin', departmentId?: string) {
    const client = await getAdminClient();
    if ('error' in client) return client;
    const { supabase } = client;

    const updates: any = { role };
    if (role === 'officer') {
        if (!departmentId) return { error: "Department is required for Officers" };
        updates.department_id = departmentId;
    } else {
        updates.department_id = null; // Reset department for non-officers
    }

    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

    if (error) return { error: error.message };
    return { success: true };
}

export async function toggleUserStatus(userId: string, isActive: boolean) {
    const client = await getAdminClient();
    if ('error' in client) return client;
    const { supabase } = client;

    const { error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', userId);

    if (error) return { error: error.message };
    return { success: true };
}

// --- DEPARTMENT MANAGEMENT ---
export async function getDepartments() {
    const client = await getAdminClient();
    if ('error' in client) return client;
    const { supabase } = client;

    const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

    if (error) return { error: error.message };
    return { data };
}

export async function createDepartment(name: string, description?: string) {
    const client = await getAdminClient();
    if ('error' in client) return client;
    const { supabase } = client;

    const { error } = await supabase
        .from('departments')
        .insert({ name, description });

    if (error) return { error: error.message };
    return { success: true };
}

export async function deleteDepartment(id: string) {
    const client = await getAdminClient();
    if ('error' in client) return client;
    const { supabase } = client;

    const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

    if (error) return { error: error.message };
    return { success: true };
}

// --- GRIEVANCE MANAGEMENT ---
export async function getAllGrievances(filter?: string) {
    const client = await getAdminClient();
    if ('error' in client) return client;
    const { supabase } = client;

    let query = supabase
        .from('grievances')
        .select(`
            *,
            profiles:user_id (full_name, email),
            departments:department_id (name),
            assignee:assigned_officer_id (full_name)
        `)
        .order('created_at', { ascending: false });

    if (filter === 'pending') query = query.eq('status', 'pending');
    if (filter === 'resolved') query = query.eq('status', 'resolved');
    if (filter === 'unassigned') query = query.is('assigned_officer_id', null);

    const { data, error } = await query;

    if (error) return { error: error.message };
    return { data };
}

// --- ANALYTICS ---
export async function getAnalyticsData() {
    const client = await getAdminClient();
    if ('error' in client) return client;
    const { supabase } = client;

    // Fetch all grievances for aggregation
    const { data: grievances, error } = await supabase
        .from('grievances')
        .select('status, department_id, created_at, departments(name)');

    if (error) return { error: error.message };

    // 1. By Department
    const deptMap = new Map();
    grievances?.forEach((g: any) => {
        const name = g.departments?.name || 'Unassigned';
        deptMap.set(name, (deptMap.get(name) || 0) + 1);
    });
    const byDepartment = Array.from(deptMap.entries()).map(([name, value]) => ({ name, value }));

    // 2. By Status
    const statusMap = new Map();
    grievances?.forEach((g: any) => {
        statusMap.set(g.status, (statusMap.get(g.status) || 0) + 1);
    });
    const byStatus = Array.from(statusMap.entries()).map(([name, value]) => ({ name, value }));

    // 3. Trend (Last 7 Days)
    const trendMap = new Map();
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        trendMap.set(dateStr, 0);
    }

    grievances?.forEach((g: any) => {
        const dateStr = new Date(g.created_at).toISOString().split('T')[0];
        if (trendMap.has(dateStr)) {
            trendMap.set(dateStr, trendMap.get(dateStr) + 1);
        }
    });
    const trend = Array.from(trendMap.entries()).map(([date, count]) => ({ date, count }));

    return {
        data: {
            byDepartment,
            byStatus,
            trend
        }
    };
}
