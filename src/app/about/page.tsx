import { GlassPanel } from "@/components/ui/GlassPanel";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { ArrowLeft, BrainCircuit, ShieldCheck, Zap, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="relative min-h-screen p-6 overflow-hidden">
            <AnimatedBackground />

            <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <button className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors backdrop-blur-md">
                            <ArrowLeft className="w-6 h-6 text-slate-900 dark:text-white" />
                        </button>
                    </Link>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">About Jan-Mitra</h1>
                </div>

                <GlassPanel className="p-8 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 space-y-6">
                    <p className="text-xl text-slate-700 dark:text-slate-200 leading-relaxed">
                        <span className="font-bold text-blue-600 dark:text-blue-400">Jan-Mitra</span> (People's Friend) is a next-generation governance platform designed to bridge the gap between citizens and administration using cutting-edge technology.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                        <FeatureCard
                            icon={BrainCircuit}
                            title="AI Intelligence"
                            desc="Browser-side AI analyzes grievances in real-time to detect urgency, sentiment, and category without server latency."
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Blockchain Accountability"
                            desc="Every grievance resolution is hashed and stored on the Polygon network, creating an immutable public record."
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Zero Latency"
                            desc="Optimized for speed with a glassmorphic UI that feels like a native operating system."
                        />
                        <FeatureCard
                            icon={Users}
                            title="Citizen Centric"
                            desc="Designed for accessibility and transparency, putting power back into the hands of the people."
                        />
                    </div>
                </GlassPanel>

                <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
                    Built with Next.js 14, TailwindCSS, Framer Motion, and Love.
                </div>
            </div>
        </main>
    );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
    return (
        <div className="p-4 rounded-xl bg-white/20 dark:bg-white/5 border border-white/20 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{desc}</p>
        </div>
    );
}
