"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateUserRole, getDepartments } from "@/app/actions/admin";

interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onUpdate: () => void;
}

export function UserEditModal({ isOpen, onClose, user, onUpdate }: UserEditModalProps) {
    const [role, setRole] = useState<'citizen' | 'officer' | 'admin'>('citizen');
    const [departmentId, setDepartmentId] = useState<string>("");
    const [departments, setDepartments] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingDeps, setIsLoadingDeps] = useState(false);

    useEffect(() => {
        if (user) {
            setRole(user.role || 'citizen');
            setDepartmentId(user.department_id || "");
        }
    }, [user]);

    useEffect(() => {
        if (role === 'officer') {
            loadDepartments();
        }
    }, [role]);

    async function loadDepartments() {
        setIsLoadingDeps(true);
        const res = await getDepartments();
        if ((res as any).data) {
            setDepartments((res as any).data);
        }
        setIsLoadingDeps(false);
    }

    async function handleSubmit() {
        if (role === 'officer' && !departmentId) {
            toast.error("Department is required for Officers");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await updateUserRole(user.id, role, departmentId);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("User updated successfully");
                onUpdate();
                onClose();
            }
        } catch (error) {
            toast.error("Failed to update user");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle>Edit User: {user?.full_name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label>Role</Label>
                        <Select value={role} onValueChange={(v: any) => setRole(v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="citizen">Citizen</SelectItem>
                                <SelectItem value="officer">Officer</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {role === 'officer' && (
                        <div className="space-y-2">
                            <Label>Department</Label>
                            <Select value={departmentId} onValueChange={setDepartmentId}>
                                <SelectTrigger disabled={isLoadingDeps}>
                                    <SelectValue placeholder={isLoadingDeps ? "Loading..." : "Select department"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500">Assigning a department allows the officer to view and resolve grievances.</p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
