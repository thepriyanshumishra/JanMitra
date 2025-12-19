"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getDraftById, submitDraft, deleteDraft } from "@/app/actions/draft-grievance";
import { chatWithGrievanceAI } from "@/app/actions/chat-grievance";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { toast } from "sonner";
import { Loader2, Wand2, Save, ArrowLeft, CheckCircle, Trash2 } from "lucide-react";

export default function ReviewGrievancePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isAiThinking, setIsAiThinking] = useState(false);

    const [formData, setFormData] = useState({
        description: "",
        location: "",
        category: "Other",
        priority: "Medium",
        department: ""
    });

    useEffect(() => {
        if (!resolvedParams?.id) return;

        getDraftById(resolvedParams.id).then((draft) => {
            if (draft) {
                setFormData({
                    description: draft.description || "",
                    location: draft.location || "",
                    category: draft.category || "Other",
                    priority: draft.priority || "Medium",
                    department: draft.extracted_data?.department || "General Administration"
                });
            } else {
                toast.error("Draft not found");
                router.push("/dashboard/submit");
            }
            setIsLoading(false);
        });
    }, [resolvedParams.id, router]);

    const handleAiEdit = async () => {
        // Redirect back to chat to continue editing with AI
        router.push(`/dashboard/submit?draftId=${resolvedParams.id}`);
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const res = await submitDraft(resolvedParams.id, {
                description: formData.description,
                location: formData.location,
                category: formData.category,
                priority: formData.priority,
                // We also update the extracted_data json to match final edits
                extracted_data: {
                    summary: formData.description,
                    location: formData.location,
                    category: formData.category,
                    priority: formData.priority,
                    department: formData.department
                }
            });

            if (res.error) {
                toast.error(res.error);
            }
            if (res.success) {
                toast.success("Grievance submitted successfully!");
                router.push("/dashboard/submissions"); // Redirect to Order History
            } else {
                toast.error(res.error || "Failed to submit");
            }
        } catch (e) {
            toast.error("Submission failed");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Review & Submit</h1>
                <div className="flex-1" />
                <button
                    onClick={async () => {
                        if (confirm("Are you sure you want to delete this draft?")) {
                            const res = await deleteDraft(resolvedParams.id);
                            if (res.success) {
                                toast.success("Draft deleted");
                                router.push("/dashboard/drafts");
                            } else {
                                toast.error("Failed to delete draft");
                            }
                        }
                    }}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-full transition-colors"
                    title="Delete Draft"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassPanel className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Description
                            </label>
                            <div className="relative">
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full min-h-[150px] p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder="Describe the issue..."
                                />
                                <button
                                    onClick={handleAiEdit}
                                    className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-medium rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                                >
                                    <Wand2 className="w-3 h-3" />
                                    Continue with AI
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Location
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </GlassPanel>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-6">
                    <GlassPanel className="p-6 space-y-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Details</h3>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-500 uppercase">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none text-sm"
                            >
                                <option>Sanitation</option>
                                <option>Roads</option>
                                <option>Electricity</option>
                                <option>Water</option>
                                <option>Law & Order</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-500 uppercase">Priority</label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {formData.priority}
                                </div>
                                <button
                                    onClick={handleAiEdit}
                                    className="px-3 py-2 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/40 rounded-lg transition-colors flex items-center gap-1"
                                >
                                    <span className="hidden sm:inline">Challenge</span>
                                    <span className="sm:hidden">!</span>
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs text-slate-500 mb-1">Assigned Department</p>
                            <p className="font-medium text-slate-900 dark:text-white">{formData.department}</p>
                        </div>
                    </GlassPanel>

                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <CheckCircle className="w-5 h-5" />
                        )}
                        Final Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
