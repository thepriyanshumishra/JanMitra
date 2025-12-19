"use client";

import { useState } from "react";
import { createBroadcast, deactivateBroadcast } from "@/app/actions/broadcast";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Megaphone, XCircle, CheckCircle2 } from "lucide-react";

export default function AdminBroadcastsPage() {
    const [message, setMessage] = useState("");
    const [type, setType] = useState<"info" | "warning" | "error">("info");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleCreate() {
        if (!message.trim()) return;
        setIsSubmitting(true);
        const res = await createBroadcast(message, type);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Broadcast published successfully");
            setMessage("");
        }
        setIsSubmitting(false);
    }

    async function handleClear() {
        setIsSubmitting(true);
        const res = await deactivateBroadcast();
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Broadcast cleared");
        }
        setIsSubmitting(false);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">System Broadcast</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage global announcements visible to all users.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GlassPanel className="p-6 space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Megaphone className="w-5 h-5 text-purple-500" />
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Create Announcement</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Input
                                placeholder="e.g., Scheduled maintenance tonight at 10 PM"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={type} onValueChange={(v: any) => setType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="info">Info (Blue)</SelectItem>
                                    <SelectItem value="warning">Warning (Yellow)</SelectItem>
                                    <SelectItem value="error">Critical (Red)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={handleCreate} disabled={isSubmitting || !message} className="w-full">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Publish Broadcast
                        </Button>
                    </div>
                </GlassPanel>

                <GlassPanel className="p-6 space-y-6 border-red-500/20 bg-red-50/10">
                    <div className="flex items-center gap-2 mb-4">
                        <XCircle className="w-5 h-5 text-red-500" />
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Clear Active Broadcast</h2>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">
                        This will remove the current banner from the top of the application for all users.
                    </p>
                    <Button variant="destructive" onClick={handleClear} disabled={isSubmitting} className="w-full">
                        Clear Broadcast
                    </Button>
                </GlassPanel>
            </div>
        </div>
    );
}
