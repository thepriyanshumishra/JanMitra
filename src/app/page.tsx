import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <AnimatedBackground />

      <div className="z-10 w-full max-w-5xl space-y-8 text-center">
        {/* Hero Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/40 dark:bg-white/10 border border-white/60 dark:border-white/20 backdrop-blur-md text-sm text-blue-700 dark:text-blue-200 shadow-sm animate-fade-in-up">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400 mr-2 animate-pulse" />
          JAN-MITRA: Intelligence Layer Live
        </div>

        {/* Hero Text */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
          Governance with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Intelligence</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">Accountability</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-blue-100/80 max-w-2xl mx-auto leading-relaxed font-medium">
          Portals collect complaints. <span className="font-bold text-slate-900 dark:text-white">JAN-MITRA resolves them.</span>
          <br />
          AI-powered prioritization, blockchain-backed accountability, and zero-latency governance.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <GlassPanel className="px-8 py-4 flex items-center justify-center gap-2 group bg-blue-600/90 hover:bg-blue-600 text-white border-transparent shadow-lg hover:shadow-blue-500/30">
              <span className="font-semibold">Launch Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </GlassPanel>
          </Link>
          <Link href="/about" className="w-full sm:w-auto">
            <GlassPanel className="px-8 py-4 flex items-center justify-center gap-2 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 text-slate-700 dark:text-blue-200 shadow-sm">
              <span className="font-semibold">How it Works</span>
            </GlassPanel>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <GlassPanel className="p-6 space-y-4 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 shadow-md hover:shadow-xl">
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">AI Prioritization</h3>
            <p className="text-sm text-slate-600 dark:text-blue-100/70">
              Natural Language Processing understands urgency instantly. No more "first come, first served" for critical issues.
            </p>
          </GlassPanel>

          <GlassPanel className="p-6 space-y-4 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 shadow-md hover:shadow-xl">
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Blockchain Audit</h3>
            <p className="text-sm text-slate-600 dark:text-blue-100/70">
              Every status change is hashed on Polygon. Immutable proof of SLA compliance that cannot be tampered with.
            </p>
          </GlassPanel>

          <GlassPanel className="p-6 space-y-4 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 shadow-md hover:shadow-xl">
            <div className="h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center">
              <div className="text-xl font-bold text-pink-600 dark:text-pink-400">SLA</div>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Auto-Escalation</h3>
            <p className="text-sm text-slate-600 dark:text-blue-100/70">
              Smart timers auto-escalate unresolved grievances to supervisors. Accountability is enforced by code.
            </p>
          </GlassPanel>
        </div>
      </div>
    </main>
  );
}
