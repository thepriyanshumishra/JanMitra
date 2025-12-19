"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { submitFeedback } from "@/app/actions/feedback";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    grievanceId: string;
    onSuccess: () => void;
}

export function FeedbackModal({ isOpen, onClose, grievanceId, onSuccess }: FeedbackModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit() {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setIsSubmitting(true);
        const res = await submitFeedback(grievanceId, rating, comment);

        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Thank you for your feedback!");
            onSuccess();
            onClose();
        }
        setIsSubmitting(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle>Rate Resolution</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4 text-center">
                    <p className="text-sm text-slate-500">
                        How satisfied are you with the resolution of your grievance?
                    </p>

                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`w-8 h-8 ${star <= rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-slate-300 dark:text-slate-600"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    <Textarea
                        placeholder="Any additional comments? (Optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="resize-none"
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0}>
                        {isSubmitting ? "Submitting..." : "Submit Feedback"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
