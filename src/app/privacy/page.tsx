"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function PrivacyPage() {
    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
            <div className="absolute top-6 right-6 z-50">
                <ThemeToggle />
            </div>
            <AnimatedBackground />

            <div className="absolute top-6 left-6 z-20">
                <Link href="/signup">
                    <button className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors backdrop-blur-md">
                        <ArrowLeft className="w-6 h-6 text-slate-900 dark:text-white" />
                    </button>
                </Link>
            </div>

            <GlassPanel className="max-w-4xl w-full h-[80vh] flex flex-col bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 shadow-2xl">
                <div className="p-8 border-b border-white/10 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-green-500/20 text-green-600 dark:text-green-400">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
                        <p className="text-slate-500 dark:text-slate-400">Last updated: December 2025</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 text-slate-700 dark:text-slate-300">
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, such as when you create an account, submit a grievance, or communicate with us. This may include your name, email address, location data, and images/videos related to grievances.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>To provide, maintain, and improve our services.</li>
                            <li>To process and resolve reported grievances.</li>
                            <li>To communicate with you about updates, security alerts, and support messages.</li>
                            <li>To monitor and analyze trends, usage, and activities in connection with our services.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Data Sharing</h2>
                        <p>
                            We do not share your personal information with third parties except as described in this policy. We may share information with government departments and civic bodies solely for the purpose of resolving your grievances.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Data Security</h2>
                        <p>
                            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. We use blockchain technology to ensure the integrity of grievance records.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Your Rights</h2>
                        <p>
                            You have the right to access, correct, or delete your personal information. You can manage your account settings within the application or contact us for assistance.
                        </p>
                    </section>
                </div>
            </GlassPanel>
        </main>
    );
}
