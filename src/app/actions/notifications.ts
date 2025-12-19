"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getClient() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll() { },
            },
        }
    );
}

export async function getNotifications() {
    const supabase = await getClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) return { error: error.message };
    return { data };
}

export async function markAsRead(id: string) {
    const supabase = await getClient();
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

    if (error) return { error: error.message };
    return { success: true };
}

export async function markAllAsRead() {
    const supabase = await getClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

    if (error) return { error: error.message };
    return { success: true };
}
