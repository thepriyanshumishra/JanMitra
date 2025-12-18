
"use client";

import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ExternalLink, ShieldCheck, Copy, Check, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ethers } from "ethers";
import { getProvider, CONTRACT_ADDRESS, GRIEVANCE_REGISTRY_ABI } from "@/lib/web3";

interface Transaction {
    hash: string;
    block: number;
    age: string;
    from: string;
    to: string;
    status: "Success" | "Pending";
    method: "LogGrievance" | "UpdateStatus" | "Escalate";
}

import { useLanguage } from "@/context/LanguageContext";

export default function LedgerPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const provider = getProvider();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, GRIEVANCE_REGISTRY_ABI, provider);

                // Fetch past events (last 100 blocks)
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
                // Fallback to mock data if contract not deployed
            }
        };

        fetchEvents();

        return () => {
            const provider = getProvider();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, GRIEVANCE_REGISTRY_ABI, provider);
            contract.removeAllListeners();
        };
    }, [t]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t("ledger_title")}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t("ledger_subtitle")}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-bold">{t("polygon_mainnet")}</span>
                </div>
            </div>

            <GlassPanel className="overflow-hidden bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/50 dark:bg-white/5 border-b border-white/20 dark:border-white/5 text-slate-500 dark:text-slate-400 font-medium">
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
