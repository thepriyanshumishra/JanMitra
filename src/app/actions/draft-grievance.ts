"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Message } from "./chat-grievance";

export interface DraftGrievance {
    id: string;
    created_at: string;
    status: string;
    category: string;
    priority: string;
    location: string;
    description: string;
    chat_history: Message[];
    extracted_data: any;
}

export async function saveDraft(
    draftId: string | null,
    chatHistory: Message[],
    extractedData: any
) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch { }
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const payload = {
        user_id: user.id,
        status: 'draft',
        chat_history: chatHistory,
        extracted_data: extractedData,
        // Update main fields if available in extractedData
        category: extractedData.category || 'Other',
        priority: extractedData.priority || 'Medium',
        location: extractedData.location || '',
        description: extractedData.summary || '',
        updated_at: new Date().toISOString()
    };

    if (draftId) {
        // Update existing draft
        const { data, error } = await supabase
            .from('grievances')
            .update(payload)
            .eq('id', draftId)
            .select()
            .single();

        if (error) return { error: error.message };
        return { data };
    } else {
        // Create new draft
        const { data, error } = await supabase
            .from('grievances')
            .insert(payload)
            .select()
            .single();

        if (error) return { error: error.message };
        return { data };
    }
}

export async function getDrafts() {
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
    if (!user) return [];

    const { data } = await supabase
        .from('grievances')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'draft')
        .order('updated_at', { ascending: false });

    return data || [];
}

export async function getDraftById(id: string) {
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
        .from('grievances')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error("getDraftById Error:", error);
        return null;
    }
    return data;
}

export async function submitDraft(id: string, finalData: any) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch { }
                },
            },
        }
    );

    const { error } = await supabase
        .from('grievances')
        .update({
            ...finalData,
            status: 'pending', // Promote to pending
            submitted_at: new Date().toISOString()
        })
        .eq('id', id);

    if (error) return { error: error.message };
    return { success: true };
}

export async function getSubmissions() {
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
    if (!user) return [];

    const { data } = await supabase
        .from('grievances')
        .select('*')
        .eq('user_id', user.id)
        .neq('status', 'draft')
        .order('submitted_at', { ascending: false });

    return data || [];
}

export async function deleteDraft(id: string) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch { }
                },
            },
        }
    );

    const { error } = await supabase
        .from('grievances')
        .delete()
        .eq('id', id);

    if (error) return { error: error.message };
    return { success: true };
}

export async function getGrievanceByTrackingId(trackingId: string) {
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
        .from('grievances')
        .select('*')
        .eq('tracking_id', trackingId)
        .single();

    if (error) return null;
    return data;
}
