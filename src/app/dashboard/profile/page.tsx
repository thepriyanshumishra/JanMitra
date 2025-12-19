"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, User, Mail, Shield, Save, Edit2, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
    const { profile, fetchProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || "");
            loadActivity();
        }
    }, [profile]);

    async function loadActivity() {
        const { data } = await supabase
            .from('grievances')
            .select('id, summary, status, created_at')
            .eq('user_id', profile?.id)
            .order('created_at', { ascending: false })
            .limit(5);

        if (data) setRecentActivity(data);
    }

    async function handleSave() {
        setIsSaving(true);

        const { error } = await supabase
            .from('profiles')
            .update({ full_name: fullName })
            .eq('id', profile?.id);

        if (error) {
            toast.error("Failed to update profile");
        } else {
            toast.success("Profile updated successfully");
            if (profile?.id) await fetchProfile(profile.id); // Refresh context
            setIsEditing(false);
        }
        setIsSaving(false);
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your account settings and view activity.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Profile Card */}
                <GlassPanel className="md:col-span-2 p-8">
                    <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-6">
                            <Avatar className="w-24 h-24 border-4 border-white/10 shadow-xl">
                                <AvatarImage src={profile.avatar_url || ""} />
                                <AvatarFallback className="text-2xl bg-purple-600 text-white">
                                    {profile.full_name?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {profile.full_name}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <Shield className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm font-medium text-purple-500 capitalize">
                                        {profile.role} Account
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <Edit2 className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label>Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    disabled={!isEditing}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    value={profile.email || ""}
                                    disabled
                                    className="pl-10 bg-slate-50 dark:bg-slate-900/50"
                                />
                            </div>
                            <p className="text-xs text-slate-500">Email cannot be changed.</p>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end pt-4">
                                <Button onClick={handleSave} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700 text-white">
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </GlassPanel>

                {/* Impact Score */}
                <GlassPanel className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-purple-500" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Citizen Impact</h3>
                    </div>
                    <div className="text-center py-4">
                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                            {recentActivity.length * 50}
                        </div>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">Impact Score</p>
                    </div>
                    <div className="text-xs text-center text-slate-400 mt-4">
                        Keep reporting to improve your community score!
                    </div>
                </GlassPanel>

                {/* Activity Feed */}
                <GlassPanel className="p-6 h-fit">
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
                    </div>

                    <div className="space-y-4">
                        {recentActivity.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">No recent activity.</p>
                        ) : (
                            recentActivity.map((item) => (
                                <div key={item.id} className="pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs text-slate-400">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${item.status === 'resolved' ? 'border-green-500/30 text-green-500' :
                                            item.status === 'rejected' ? 'border-red-500/30 text-red-500' :
                                                'border-yellow-500/30 text-yellow-500'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-2">
                                        {item.summary}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}
