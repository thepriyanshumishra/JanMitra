"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { updateGrievanceStatus } from "@/app/actions/officer-grievance";

interface GrievanceUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    grievanceId: string;
    currentStatus: string;
    onUpdate: () => void;
}

export function GrievanceUpdateModal({ isOpen, onClose, grievanceId, currentStatus, onUpdate }: GrievanceUpdateModalProps) {
    const [status, setStatus] = useState(currentStatus);
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit() {
        if (!note.trim()) {
            toast.error("Please add a note explaining the update.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await updateGrievanceStatus(grievanceId, status, note);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Grievance updated successfully");
                onUpdate();
                onClose();
            }
        } catch (error) {
            toast.error("Failed to update grievance");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle>Update Status</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label>New Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-orange-500" />
                                        Pending
                                    </div>
                                </SelectItem>
                                <SelectItem value="in_progress">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-blue-500" />
                                        In Progress
                                    </div>
                                </SelectItem>
                                <SelectItem value="resolved">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Resolved
                                    </div>
                                </SelectItem>
                                <SelectItem value="rejected">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="w-4 h-4 text-red-500" />
                                        Rejected
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Official Note</Label>
                        <Textarea
                            placeholder="Describe the action taken or reason for status change..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="h-32 resize-none"
                        />
                        <p className="text-xs text-slate-500">This note will be visible in the grievance history.</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || status === currentStatus && !note}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update Status"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
