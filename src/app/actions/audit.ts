"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Internal helper to log actions
export async function logAction(userId: string, action: string, details: any) {
    // Use service role to ensure log is always written regardless of user permissions
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    await supabase.from('audit_logs').insert({
        user_id: userId,
        action,
        details
    });
}

export async function getAuditLogs() {
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

    // Verify Admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') return { error: "Forbidden" };

    const { data, error } = await supabase
        .from('audit_logs')
        .select(`
            *,
            profiles:user_id (full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) return { error: error.message };
    return { data };
}
