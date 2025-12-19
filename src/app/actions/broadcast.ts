"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getActiveBroadcast() {
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

    const { data, error } = await supabase
        .from('broadcasts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') return { error: error.message }; // PGRST116 is "no rows returned"
    return { data };
}

export async function createBroadcast(message: string, type: 'info' | 'warning' | 'error') {
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

    // Deactivate all others first (optional, but good for single banner)
    await supabase.from('broadcasts').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');

    const { error } = await supabase
        .from('broadcasts')
        .insert({
            message,
            type,
            created_by: user.id,
            is_active: true
        });

    if (error) return { error: error.message };
    return { success: true };
}

export async function deactivateBroadcast() {
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

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: "Forbidden" };

    const { error } = await supabase
        .from('broadcasts')
        .update({ is_active: false })
        .eq('is_active', true);

    if (error) return { error: error.message };
    return { success: true };
}
