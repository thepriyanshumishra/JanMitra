"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
    id: string;
    user_id: string;
    type: NotificationType;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    loading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchNotifications = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from("notifications")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(50);

            if (error) throw error;
            setNotifications(data || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            setNotifications([]);
            setLoading(false);
            return;
        }

        fetchNotifications();

        // Subscribe to real-time changes
        const channel = supabase
            .channel("notifications-changes")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    const newNotification = payload.new as Notification;
                    setNotifications((prev) => [newNotification, ...prev]);

                    // Show toast for new notification
                    toast(newNotification.message, {
                        description: "New Notification",
                        action: {
                            label: "View",
                            onClick: () => { }, // Could navigate to a notifications page if it existed
                        },
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const markAsRead = async (id: string) => {
        try {
            // Optimistic update
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            );

            const { error } = await supabase
                .from("notifications")
                .update({ is_read: true })
                .eq("id", id);

            if (error) throw error;
        } catch (error) {
            console.error("Error marking notification as read:", error);
            // Revert optimistic update on error (simplified for now, usually would refetch)
            fetchNotifications();
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;

        try {
            // Optimistic update
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

            const { error } = await supabase
                .from("notifications")
                .update({ is_read: true })
                .eq("user_id", user.id)
                .eq("is_read", false);

            if (error) throw error;
        } catch (error) {
            console.error("Error marking all as read:", error);
            fetchNotifications();
        }
    };

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead,
                loading,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}
