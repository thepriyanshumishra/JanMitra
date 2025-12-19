"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getAssignedGrievances() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll() { },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { data, error } = await supabase
        .from('grievances')
        .select(`
            *,
            profiles:user_id (full_name, email, avatar_url),
            departments:department_id (name)
        `)
        .eq('assigned_officer_id', user.id)
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { data };
}

export async function getDepartmentGrievances() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll() { },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // Get officer's department
    const { data: profile } = await supabase
        .from('profiles')
        .select('department_id')
        .eq('id', user.id)
        .single();

    if (!profile?.department_id) return { error: "No department assigned" };

    const { data, error } = await supabase
        .from('grievances')
        .select(`
            *,
            profiles:user_id (full_name, email, avatar_url),
            departments:department_id (name)
        `)
        .eq('department_id', profile.department_id)
        .order('created_at', { ascending: false });

    if (error) return { error: error.message };
    return { data };
}

export async function updateGrievanceStatus(grievanceId: string, status: string, note?: string) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll() { },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // Fetch current grievance to append history and get user email
    const { data: currentGrievance } = await supabase
        .from('grievances')
        .select('status_history, internal_notes, profiles:user_id (email)')
        .eq('id', grievanceId)
        .single();

    const historyEntry = {
        status,
        changed_by: user.id,
        timestamp: new Date().toISOString(),
        note: note || "Status updated"
    };

    const newHistory = [...(currentGrievance?.status_history || []), historyEntry];

    const updates: any = {
        status,
        status_history: newHistory,
        updated_at: new Date().toISOString()
    };

    if (note) {
        const newNotes = [...(currentGrievance?.internal_notes || []), `${new Date().toISOString()}: ${note} - by ${user.email}`];
        updates.internal_notes = newNotes;
    }

    const { error } = await supabase
        .from('grievances')
        .update(updates)
        .eq('id', grievanceId);

    if (error) return { error: error.message };

    // Send Email Notification
    const grievanceData = currentGrievance as any;
    if (grievanceData?.profiles?.email) {
        const { sendEmail } = await import("./email");
        await sendEmail({
            to: grievanceData.profiles.email,
            subject: `Grievance Update: #${grievanceId.slice(0, 8)}`,
            body: `Your grievance status has been updated to: ${status.toUpperCase()}.\n\nNote: ${note || "No additional notes."}`
        });
    }

    return { success: true };
}

export async function assignGrievance(grievanceId: string) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll() { },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // Fetch current grievance to check if already assigned
    const { data: currentGrievance } = await supabase
        .from('grievances')
        .select('assigned_officer_id, status_history')
        .eq('id', grievanceId)
        .single();

    if (currentGrievance?.assigned_officer_id) {
        return { error: "Already assigned" };
    }

    const historyEntry = {
        status: 'assigned',
        changed_by: user.id,
        timestamp: new Date().toISOString(),
        note: `Self-assigned by ${user.email}`
    };

    const newHistory = [...(currentGrievance?.status_history || []), historyEntry];

    const { error } = await supabase
        .from('grievances')
        .update({
            assigned_officer_id: user.id,
            status: 'in_progress', // Auto-move to in_progress on assignment? Or keep pending? Let's say in_progress.
            status_history: newHistory,
            updated_at: new Date().toISOString()
        })
        .eq('id', grievanceId);

    if (error) return { error: error.message };
    return { success: true };
}

export async function getOfficerStats() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll() { },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // Get officer's department
    const { data: profile } = await supabase
        .from('profiles')
        .select('department_id')
        .eq('id', user.id)
        .single();

    if (!profile?.department_id) return { error: "No department assigned" };

    // Parallel fetch
    const [
        { count: assignedTotal },
        { count: assignedPending },
        { count: assignedResolved },
        { count: deptPending }
    ] = await Promise.all([
        supabase.from('grievances').select('*', { count: 'exact', head: true }).eq('assigned_officer_id', user.id),
        supabase.from('grievances').select('*', { count: 'exact', head: true }).eq('assigned_officer_id', user.id).neq('status', 'resolved').neq('status', 'rejected'),
        supabase.from('grievances').select('*', { count: 'exact', head: true }).eq('assigned_officer_id', user.id).eq('status', 'resolved'),
        supabase.from('grievances').select('*', { count: 'exact', head: true }).eq('department_id', profile.department_id).eq('status', 'pending')
    ]);

    return {
        data: {
            assignedTotal: assignedTotal || 0,
            assignedPending: assignedPending || 0,
            assignedResolved: assignedResolved || 0,
            deptPending: deptPending || 0
        }
    };
}

export async function getGrievanceDetails(id: string) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll() { },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { data, error } = await supabase
        .from('grievances')
        .select(`
            *,
            profiles:user_id (full_name, email, avatar_url, phone_number),
            departments:department_id (name)
        `)
        .eq('id', id)
        .single();

    if (error) return { error: error.message };
    return { data };
}

export async function getDepartmentColleagues() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll() { },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // Get officer's department
    const { data: profile } = await supabase
        .from('profiles')
        .select('department_id')
        .eq('id', user.id)
        .single();

    if (!profile?.department_id) return { error: "No department assigned" };

    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, avatar_url')
        .eq('department_id', profile.department_id)
        .neq('id', user.id); // Exclude self

    if (error) return { error: error.message };
    return { data };
}
