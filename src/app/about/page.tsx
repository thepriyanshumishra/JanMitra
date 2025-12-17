import { GlassPanel } from "@/components/ui/GlassPanel";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { ArrowLeft, BrainCircuit, ShieldCheck, Zap, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="relative min-h-screen flex flex-col overflow-x-hidden">
            <AnimatedBackground />

            {/* Header */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-12 pb-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/">
                        <button className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors backdrop-blur-md border border-white/20">
                            <ArrowLeft className="w-6 h-6 text-slate-900 dark:text-white" />
                        </button>
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">The Jan-Mitra Story</h1>
                </div>

                <div className="space-y-16">
                    {/* Section 1: The Problem */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-l-4 border-red-500 pl-4">
                            The Hidden Disease
                        </h2>
                        <GlassPanel className="p-8 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10">
                            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                                Most existing redressal systems assume the problem is just <span className="font-bold text-red-500">delayed resolution</span>.
                                But delay is just a symptom—not the disease. The real issues are hidden deep within the governance system:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ProblemCard
                                    title="Discovery Gap"
                                    desc="Citizens don't know which department handles their issue. It's like a patient not knowing whether they need a heart specialist or a general physician."
                                />
                                <ProblemCard
                                    title="Digital Trust Gap"
                                    desc="People doubt if filing a complaint will actually change anything. 'Will anyone even read this?'"
                                />
                                <ProblemCard
                                    title="Unstructured Inputs"
                                    desc="Public inputs are emotional and mixed. Systems treat them as raw text, missing the context and urgency."
                                />
                                <ProblemCard
                                    title="No Urgency Intelligence"
                                    desc="A water leakage and a building collapse often get the same priority in a first-come-first-served list."
                                />
                            </div>
                        </GlassPanel>
                    </section>

                    {/* Section 2: The Solution */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-l-4 border-blue-500 pl-4">
                            Our Solution: "Understand First, Act Smartly"
                        </h2>
                        <GlassPanel className="p-8 bg-blue-50/40 dark:bg-blue-900/10 border-blue-100 dark:border-blue-500/20">
                            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
                                Jan-Mitra isn't just a tracking tool. It's an <span className="font-bold text-blue-600 dark:text-blue-400">urgency-aware decision system</span>.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">1</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI-Based Understanding</h3>
                                        <p className="text-slate-600 dark:text-slate-400">Just as a teacher deciphers messy handwriting, our AI understands the intent, sentiment, and urgency behind a citizen's complaint.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">2</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Priority & SLA Engine</h3>
                                        <p className="text-slate-600 dark:text-slate-400">Critical issues get the fast lane. Routine issues get the normal lane. It's the "Ambulance Logic" applied to governance.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 font-bold">3</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Auto-Escalation</h3>
                                        <p className="text-slate-600 dark:text-slate-400">If a deadline is crossed, the system automatically escalates it to higher authorities. Accountability is enforced by code.</p>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>
                    </section>

                    {/* Section 3: Impact */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
                            The Impact: Restoring Trust
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <GlassPanel className="p-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2">For Citizens</h3>
                                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                                    <li>Live "Amazon-style" tracking of complaints.</li>
                                    <li>Assurance that critical issues are prioritized.</li>
                                    <li>Transparent feedback loop.</li>
                                </ul>
                            </GlassPanel>
                            <GlassPanel className="p-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2">For Administration</h3>
                                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                                    <li>Reduced backlog through smart routing.</li>
                                    <li>Data-driven insights for policy making.</li>
                                    <li>Automated accountability tracking.</li>
                                </ul>
                            </GlassPanel>
                        </div>
                    </section>

                    <div className="text-center pt-12 pb-8">
                        <p className="text-xl font-medium text-slate-900 dark:text-white mb-4">
                            Jan-Mitra makes governance more human, more intelligent, and more trustworthy.
                        </p>
                        <Link href="/dashboard">
                            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                                Experience the Future
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

function ProblemCard({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
            <h3 className="font-bold text-red-700 dark:text-red-400 mb-2">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
        </div>
    );
}
