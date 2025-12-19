"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getGrievanceDetails } from "@/app/actions/officer-grievance";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Loader2, MapPin, Calendar, User, Phone, Mail, Clock, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GrievanceUpdateModal } from "@/components/dashboard/GrievanceUpdateModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GrievanceTimeline } from "@/components/dashboard/GrievanceTimeline";

export default function OfficerGrievanceDetailsPage() {
    const params = useParams();
    const [grievance, setGrievance] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadGrievance();
    }, []);

    async function loadGrievance() {
        setIsLoading(true);
        const res = await getGrievanceDetails(params.id as string);
        if (res.error) {
            toast.error("Failed to load grievance details");
        } else {
            setGrievance(res.data);
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

    if (!grievance) return <div>Grievance not found</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Grievance #{grievance.id.slice(0, 8)}
                        </h1>
                        <Badge variant="outline" className={
                            grievance.status === 'resolved' ? 'border-green-500/30 text-green-500' :
                                grievance.status === 'rejected' ? 'border-red-500/30 text-red-500' :
                                    'border-yellow-500/30 text-yellow-500'
                        }>
                            {grievance.status.replace('_', ' ')}
                        </Badge>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Reported on {new Date(grievance.created_at).toLocaleString()}
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                    Update Status
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <GlassPanel className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Description</h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {grievance.description || grievance.summary}
                        </p>
                        {grievance.location && (
                            <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-sm text-slate-600 dark:text-slate-400">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>{grievance.location}</span>
                            </div>
                        )}
                    </GlassPanel>

                    {/* AI Analysis */}
                    <GlassPanel className="p-6 space-y-4 border-l-4 border-l-purple-500">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-purple-500" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI Analysis</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                <span className="text-xs text-slate-500 uppercase">Category</span>
                                <p className="font-medium text-slate-900 dark:text-white">{grievance.category}</p>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                <span className="text-xs text-slate-500 uppercase">Priority</span>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${grievance.priority === 'high' ? 'bg-red-500' :
                                        grievance.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                        }`} />
                                    <p className="font-medium text-slate-900 dark:text-white capitalize">{grievance.priority}</p>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>

                    {/* Internal Notes */}
                    <GlassPanel className="p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Internal Notes</h3>
                        </div>
                        {grievance.internal_notes && grievance.internal_notes.length > 0 ? (
                            <div className="space-y-3">
                                {grievance.internal_notes.map((note: string, i: number) => (
                                    <div key={i} className="p-3 bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 rounded-lg text-sm">
                                        {note}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 italic">No internal notes yet.</p>
                        )}
                    </GlassPanel>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Citizen Info */}
                    <GlassPanel className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Citizen Details</h3>
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={grievance.profiles?.avatar_url} />
                                <AvatarFallback>{grievance.profiles?.full_name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">{grievance.profiles?.full_name}</p>
                                <p className="text-xs text-slate-500">Citizen</p>
                            </div>
                        </div>
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <Mail className="w-4 h-4" />
                                <span>{grievance.profiles?.email}</span>
                            </div>
                            {grievance.profiles?.phone_number && (
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                    <Phone className="w-4 h-4" />
                                    <span>{grievance.profiles.phone_number}</span>
                                </div>
                            )}
                        </div>
                    </GlassPanel>

                    {/* Timeline */}
                    <GrievanceTimeline
                        history={grievance.status_history}
                        createdAt={grievance.created_at}
                    />
                </div>
            </div>

            <GrievanceUpdateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                grievanceId={grievance.id}
                currentStatus={grievance.status}
                onUpdate={loadGrievance}
            />
        </div>
    );
}
