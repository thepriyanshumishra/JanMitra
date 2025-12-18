"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type UserRole = "citizen" | "officer" | "admin";

export interface UserProfile {
    id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: UserRole;
    department_id: string | null;
    is_active: boolean;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    session: Session | null;
    isLoading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Fetch user profile from database with retry logic
    const fetchProfile = async (userId: string, retryCount = 0): Promise<UserProfile | null> => {
        console.log(`🔍 Fetching profile for user ID: ${userId} (Attempt ${retryCount + 1})`);

        // Create a timeout promise (increased to 15s)
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Profile fetch timed out")), 15000)
        );

        try {
            // Race the query against the timeout
            const { data, error } = await Promise.race([
                supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", userId)
                    .single(),
                timeoutPromise
            ]) as any;

            if (error) {
                console.error("❌ Error fetching profile:", error);

                // Retry once if it's a timeout or connection error
                if (retryCount < 1) {
                    console.log("🔄 Retrying profile fetch in 1s...");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return fetchProfile(userId, retryCount + 1);
                }

                return null;
            }

            // Check if user is active
            if (data && data.is_active === false) {
                console.warn("⛔ User is inactive/pending approval");
                await supabase.auth.signOut();
                toast.error("Account pending approval. Please contact admin.");
                return null;
            }

            console.log("✅ Profile fetched successfully:", data);
            return data as UserProfile;
        } catch (err) {
            console.error("❌ Exception in fetchProfile:", err);

            // Retry on timeout exception too
            if (retryCount < 1) {
                console.log("🔄 Retrying profile fetch after exception...");
                await new Promise(resolve => setTimeout(resolve, 1000));
                return fetchProfile(userId, retryCount + 1);
            }

            return null;
        }
    };

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                const userProfile = await fetchProfile(session.user.id);
                setProfile(userProfile);
            }

            setIsLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                const userProfile = await fetchProfile(session.user.id);
                setProfile(userProfile);
            } else {
                setProfile(null);
            }

            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        });

        if (error) {
            console.error("Error signing in with Google:", error.message);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, profile, session, isLoading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
