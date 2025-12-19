"use client";

import { Bell, Check, Info, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/context/NotificationContext";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-auto py-1 px-2"
                            onClick={() => markAllAsRead()}
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
                            <Bell className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "flex gap-3 p-4 transition-colors hover:bg-muted/50 cursor-pointer",
                                        !notification.is_read && "bg-muted/20"
                                    )}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="mt-1">
                                        {notification.type === "info" && <Info className="h-4 w-4 text-blue-500" />}
                                        {notification.type === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                                        {notification.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                                        {notification.type === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className={cn("text-sm leading-none", !notification.is_read && "font-medium")}>
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                    {!notification.is_read && (
                                        <div className="flex items-center justify-center">
                                            <div className="h-2 w-2 rounded-full bg-blue-600" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
