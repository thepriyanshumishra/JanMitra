"use client";

import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ExternalLink, ShieldCheck, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
    hash: string;
    block: number;
    age: string;
    from: string;
    to: string;
    status: "Success" | "Pending";
    method: "LogGrievance" | "UpdateStatus" | "Escalate";
}

export default function LedgerPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        // Generate initial mock blockchain data
        const initialTx: Transaction[] = Array.from({ length: 10 }).map((_, i) => ({
            hash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
            block: 45000000 + i,
            age: `${Math.floor(Math.random() * 59)}s ago`,
            from: "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("").substring(0, 8) + "...",
            to: "JanMitra_Polygon_Contract",
            status: "Success",
            method: ["LogGrievance", "UpdateStatus", "Escalate"][Math.floor(Math.random() * 3)] as any,
        }));
        setTransactions(initialTx);

        // Simulate new blocks
        const interval = setInterval(() => {
            setTransactions(prev => {
                const newTx: Transaction = {
                    hash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
                    block: prev[0].block + 1,
                    age: "Just now",
                    from: "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("").substring(0, 8) + "...",
                    to: "JanMitra_Polygon_Contract",
                    status: "Success",
                    method: ["LogGrievance", "UpdateStatus", "Escalate"][Math.floor(Math.random() * 3)] as any,
                };
                return [newTx, ...prev].slice(0, 15);
            });
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Public Accountability Ledger</h1>
                    <p className="text-slate-500 dark:text-slate-400">Immutable record of all governance actions on Polygon PoS.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-bold">Polygon Mainnet</span>
                </div>
            </div>

            <GlassPanel className="overflow-hidden bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/50 dark:bg-white/5 border-b border-white/20 dark:border-white/5 text-slate-500 dark:text-slate-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Tx Hash</th>
                                <th className="px-6 py-4">Method</th>
                                <th className="px-6 py-4">Block</th>
                                <th className="px-6 py-4">Age</th>
                                <th className="px-6 py-4">From</th>
                                <th className="px-6 py-4">To</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/20 dark:divide-white/5">
                            {transactions.map((tx) => (
                                <tr key={tx.hash} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-blue-600 dark:text-blue-400 truncate max-w-[150px]">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate">{tx.hash}</span>
                                            <CopyButton text={tx.hash} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2 py-1 rounded text-xs font-medium border",
                                            tx.method === "Escalate" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800" :
                                                tx.method === "LogGrievance" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" :
                                                    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                                        )}>
                                            {tx.method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{tx.block}</td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{tx.age}</td>
                                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">{tx.from}</td>
                                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3 text-purple-500" />
                                        {tx.to}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Success
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassPanel>
        </div>
    );
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button onClick={copy} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
        </button>
    );
}

function CheckCircle2({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
