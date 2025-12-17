import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ArrowRight, ShieldCheck, Zap, BrainCircuit, Clock, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <AnimatedBackground />

      {/* Hero Section */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-32 pb-20 text-center space-y-8">
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
        {/* The Reality Check (Research Data) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
          <div className="col-span-1 md:col-span-3 text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Why We Built This</h2>
            <p className="text-slate-600 dark:text-slate-400">The current system is overwhelmed. The data speaks for itself.</p>
          </div>

          <GlassPanel className="p-6 bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20">
            <div className="text-4xl font-black text-red-600 dark:text-red-400 mb-2">1.2 Cr+</div>
            <div className="font-bold text-slate-900 dark:text-white mb-2">Public Complaints</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Filed in the last 5 years. The volume is massive.</p>
          </GlassPanel>

          <GlassPanel className="p-6 bg-orange-50/50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/20">
            <div className="text-4xl font-black text-orange-600 dark:text-orange-400 mb-2">36%</div>
            <div className="font-bold text-slate-900 dark:text-white mb-2">Missed Deadlines</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Cases crossing SLA timelines without accountability.</p>
          </GlassPanel>

          <GlassPanel className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700">
            <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">63,000</div>
            <div className="font-bold text-slate-900 dark:text-white mb-2">Pending Monthly</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">New backlog added every single month.</p>
          </GlassPanel>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassPanel className="p-8 space-y-4 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">AI Prioritization</h3>
            <p className="text-sm text-slate-600 dark:text-blue-100/70 leading-relaxed">
              Natural Language Processing understands urgency instantly. No more "first come, first served" for critical issues like fire or flooding.
            </p>
          </GlassPanel>

          <GlassPanel className="p-8 space-y-4 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Blockchain Audit</h3>
            <p className="text-sm text-slate-600 dark:text-blue-100/70 leading-relaxed">
              Every status change is hashed on Polygon. Immutable proof of SLA compliance that cannot be tampered with by officials.
            </p>
          </GlassPanel>

          <GlassPanel className="p-8 space-y-4 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center">
              <div className="text-xl font-bold text-pink-600 dark:text-pink-400">SLA</div>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Auto-Escalation</h3>
            <p className="text-sm text-slate-600 dark:text-blue-100/70 leading-relaxed">
              Smart timers auto-escalate unresolved grievances to supervisors. Accountability is enforced by code, not bureaucracy.
            </p>
          </GlassPanel>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative z-10 w-full bg-white/30 dark:bg-black/20 backdrop-blur-sm py-24 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">From Complaint to Resolution</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A transparent journey powered by automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0" />

            <StepCard
              number="01"
              title="Citizen Reports"
              desc="Upload photo/video. AI auto-tags location and category."
              icon={Users}
            />
            <StepCard
              number="02"
              title="AI Analyzes"
              desc="Severity score assigned. Routed to correct department instantly."
              icon={BrainCircuit}
            />
            <StepCard
              number="03"
              title="Action Taken"
              desc="Crews dispatched. Status updated on public ledger."
              icon={CheckCircle2}
            />
          </div>
        </div>
      </div>

      {/* Live Stats Section */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard value="12,450+" label="Grievances Resolved" />
          <StatCard value="98.2%" label="SLA Compliance" />
          <StatCard value="2.4 hrs" label="Avg. Response Time" />
          <StatCard value="150+" label="Civic Departments" />
        </div>
      </div>

      <Footer />
    </main>
  );
}

function StepCard({ number, title, desc, icon: Icon }: any) {
  return (
    <div className="relative flex flex-col items-center text-center space-y-4">
      <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-4 border-blue-100 dark:border-blue-900 flex items-center justify-center shadow-xl z-10">
        <Icon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="space-y-2">
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400 tracking-wider">STEP {number}</span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
          {desc}
        </p>
      </div>
    </div>
  );
}

function StatCard({ value, label }: any) {
  return (
    <GlassPanel className="p-6 text-center bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10">
      <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
        {value}
      </div>
      <div className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
        {label}
      </div>
    </GlassPanel>
  );
}

