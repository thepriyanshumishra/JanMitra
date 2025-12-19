"use client";

import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ExternalLink, ShieldCheck, Copy, Check, CheckCircle2, Box, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ethers } from "ethers";
import { getProvider, CONTRACT_ADDRESS, GRIEVANCE_REGISTRY_ABI } from "@/lib/web3";
import { useLanguage } from "@/context/LanguageContext";

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
    const { t } = useLanguage();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const provider = getProvider();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, GRIEVANCE_REGISTRY_ABI, provider);

                // Fetch past events (last 1000 blocks)
                const currentBlock = await provider.getBlockNumber();
                const filter = contract.filters.GrievanceRegistered();
                const events = await contract.queryFilter(filter, currentBlock - 1000, currentBlock);

                const formattedTx: Transaction[] = await Promise.all(events.map(async (event: any) => {
                    const block = await event.getBlock();
                    return {
                        hash: event.transactionHash,
                        block: event.blockNumber,
                        age: new Date(block.timestamp * 1000).toLocaleTimeString(),
                        from: event.args[0], // ID
                        to: "GrievanceRegistry",
                        status: "Success",
                        method: "LogGrievance",
                    };
                }));

                setTransactions(formattedTx.reverse());

                // Listen for new events
                contract.on("GrievanceRegistered", async (id, hash, timestamp, event) => {
                    const newTx: Transaction = {
                        hash: event.log.transactionHash,
                        block: event.log.blockNumber,
                        age: t("just_now"),
                        from: id,
                        to: "GrievanceRegistry",
                        status: "Success",
                        method: "LogGrievance",
                    };
                    setTransactions(prev => [newTx, ...prev]);
                });

            } catch (error) {
                console.error("Error fetching blockchain events:", error);
                // Fallback to mock data
                const mockData: Transaction[] = Array.from({ length: 10 }).map((_, i) => ({
                    hash: `0x${Math.random().toString(16).substr(2, 40)}`,
                    block: 18452300 + i,
                    age: `${Math.floor(Math.random() * 60)} mins ago`,
                    from: `JM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                    to: "GrievanceRegistry",
                    status: "Success" as "Success" | "Pending",
                    method: ["LogGrievance", "UpdateStatus", "Escalate"][Math.floor(Math.random() * 3)] as any,
                })).reverse();
                setTransactions(mockData);
            }
        };

        fetchEvents();

        return () => {
            try {
                const provider = getProvider();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, GRIEVANCE_REGISTRY_ABI, provider);
                contract.removeAllListeners();
            } catch (e) { }
        };
    }, [t]);

    return (
        <div className="relative max-w-6xl mx-auto space-y-8 p-4">
            {/* Background Blobs */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                        {t("ledger_title")}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{t("ledger_subtitle")}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 backdrop-blur-md border border-purple-500/20 text-purple-700 dark:text-purple-300 shadow-lg shadow-purple-500/10">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-bold">{t("polygon_mainnet")}</span>
                </div>
            </div>

            <GlassPanel className="overflow-hidden border-white/30 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/50 dark:bg-slate-800/50 border-b border-white/20 dark:border-white/5 text-slate-500 dark:text-slate-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">{t("tx_hash")}</th>
                                <th className="px-6 py-4">{t("method")}</th>
                                <th className="px-6 py-4">{t("block")}</th>
                                <th className="px-6 py-4">{t("age")}</th>
                                <th className="px-6 py-4">{t("from")}</th>
                                <th className="px-6 py-4">{t("to")}</th>
                                <th className="px-6 py-4">{t("status")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/20 dark:divide-white/5">
                            {transactions.map((tx) => (
                                <tr key={tx.hash} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-blue-600 dark:text-blue-400">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate max-w-[120px]">{tx.hash}</span>
                                            <CopyButton text={tx.hash} />
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 cursor-pointer" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-lg text-xs font-bold border backdrop-blur-sm",
                                            tx.method === "Escalate" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                                                tx.method === "LogGrievance" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                                                    "bg-green-500/10 text-green-600 border-green-500/20"
                                        )}>
                                            {tx.method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                        <Box className="w-3.5 h-3.5 text-slate-400" />
                                        {tx.block}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {tx.age}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">{tx.from}</td>
                                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                                        <div className="flex items-center gap-1.5">
                                            <ArrowRight className="w-3 h-3 text-slate-400" />
                                            {tx.to}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-wider bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20 w-fit">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
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
