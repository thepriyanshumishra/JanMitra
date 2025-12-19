"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { HelpCircle, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HelpCenterPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Help Center</h1>
                <p className="text-slate-500 dark:text-slate-400">Frequently asked questions and support.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <GlassPanel className="p-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <FAQItem
                                question="How do I file a grievance?"
                                answer="Simply click on 'New Grievance' in the sidebar. You can chat with our AI assistant, describe your issue, and it will automatically categorize and route it to the correct department."
                            />
                            <FAQItem
                                question="How long does it take to resolve?"
                                answer="Resolution time depends on the category. Each grievance is assigned an SLA (Service Level Agreement). You can track the estimated time in the grievance details page."
                            />
                            <FAQItem
                                question="Can I remain anonymous?"
                                answer="Yes, your personal details are only visible to the assigned officer for contact purposes. They are not shared publicly on the ledger."
                            />
                            <FAQItem
                                question="What is the Public Ledger?"
                                answer="To ensure transparency, a hash of your grievance is stored on the Polygon blockchain. This proves that your complaint was recorded and hasn't been tampered with."
                            />
                        </div>
                    </GlassPanel>
                </div>

                <div className="space-y-6">
                    <GlassPanel className="p-6 space-y-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Contact Support</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <Phone className="w-4 h-4" />
                                <span>1800-JAN-MITRA</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <MessageCircle className="w-4 h-4" />
                                <span>support@janmitra.gov.in</span>
                            </div>
                        </div>
                    </GlassPanel>

                    <GlassPanel className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20">
                        <div className="flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-blue-700 dark:text-blue-300">Need more help?</h4>
                                <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">
                                    Our support team is available 24/7 to assist you with any issues.
                                </p>
                            </div>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-100 dark:border-slate-800 last:border-0 pb-4 last:pb-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left font-medium text-slate-900 dark:text-white hover:text-purple-500 transition-colors"
            >
                {question}
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
