"use client";

import { useEffect, useState } from "react";
import { getDepartmentColleagues } from "@/app/actions/officer-grievance";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Loader2, Mail, Shield } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function OfficerTeamPage() {
    const [colleagues, setColleagues] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTeam();
    }, []);

    async function loadTeam() {
        setIsLoading(true);
        const res = await getDepartmentColleagues();
        if (res.error) {
            toast.error("Failed to load team members");
        } else {
            setColleagues(res.data || []);
        }
        setIsLoading(false);
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Team</h1>
                <p className="text-slate-500 dark:text-slate-400">Colleagues in your department.</p>
            </div>

            {colleagues.length === 0 ? (
                <GlassPanel className="p-8 text-center text-slate-500">
                    No other officers found in your department.
                </GlassPanel>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {colleagues.map((member) => (
                        <GlassPanel key={member.id} className="p-6 flex items-center gap-4">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={member.avatar_url} />
                                <AvatarFallback>{member.full_name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">{member.full_name}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                    <Shield className="w-3 h-3" />
                                    <span className="capitalize">{member.role}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                    <Mail className="w-3 h-3" />
                                    <span>{member.email}</span>
                                </div>
                            </div>
                        </GlassPanel>
                    ))}
                </div>
            )}
        </div>
    );
}
