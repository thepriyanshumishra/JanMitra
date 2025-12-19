"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function submitFeedback(grievanceId: string, rating: number, comment: string) {
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

    const { error } = await supabase
        .from('feedback')
        .insert({
            grievance_id: grievanceId,
            user_id: user.id,
            rating,
            comment
        });

    if (error) return { error: error.message };
    return { success: true };
}
