"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createDepartment } from "@/app/actions/admin";

interface CreateDepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateDepartmentModal({ isOpen, onClose, onSuccess }: CreateDepartmentModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit() {
        if (!name.trim()) {
            toast.error("Department name is required");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await createDepartment(name, description);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Department created successfully");
                setName("");
                setDescription("");
                onSuccess();
                onClose();
            }
        } catch (error) {
            toast.error("Failed to create department");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle>Create New Department</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Department Name</Label>
                        <Input
                            placeholder="e.g. Health, PWD, Police"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description (Optional)</Label>
                        <Textarea
                            placeholder="Brief description of responsibilities..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Department"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
