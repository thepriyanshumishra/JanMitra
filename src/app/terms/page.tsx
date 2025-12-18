"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { ArrowLeft, ScrollText } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function TermsPage() {
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
                    <div className="p-3 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
                        <ScrollText className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Terms & Conditions</h1>
                        <p className="text-slate-500 dark:text-slate-400">Last updated: December 2025</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 text-slate-700 dark:text-slate-300">
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Introduction</h2>
                        <p>
                            Welcome to Jan-Mitra ("we," "our," or "us"). By accessing or using our AI Governance Layer platform, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. User Responsibilities</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>You must provide accurate and complete information when registering an account.</li>
                            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            <li>You agree not to use the platform for any unlawful or unauthorized purpose.</li>
                            <li>You must not submit false or misleading grievances.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Grievance Reporting</h2>
                        <p>
                            When reporting a grievance, you agree to provide truthful details and authentic evidence (photos/videos). Misuse of the reporting system may result in account suspension.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. AI & Automated Processing</h2>
                        <p>
                            Our platform uses Artificial Intelligence to categorize and prioritize grievances. While we strive for accuracy, automated decisions should be verified. You acknowledge that AI interactions are automated and may not always be perfect.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Intellectual Property</h2>
                        <p>
                            The content, features, and functionality of Jan-Mitra are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">6. Termination</h2>
                        <p>
                            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>
                    </section>
                </div>
            </GlassPanel>
        </main>
    );
}
