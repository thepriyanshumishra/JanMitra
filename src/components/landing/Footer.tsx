"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative z-10 w-full border-t border-white/20 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-block">
                            <Logo />
                        </Link>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Empowering citizens with AI-driven governance and blockchain-backed accountability.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialLink href="#" icon={Twitter} />
                            <SocialLink href="#" icon={Github} />
                            <SocialLink href="#" icon={Linkedin} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li><Link href="/dashboard" className="hover:text-blue-500 transition-colors">Dashboard</Link></li>
                            <li><Link href="/about" className="hover:text-blue-500 transition-colors">How it Works</Link></li>
                            <li><Link href="/dashboard/ledger" className="hover:text-blue-500 transition-colors">Public Ledger</Link></li>
                            <li><Link href="/login" className="hover:text-blue-500 transition-colors">Citizen Login</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li><Link href="#" className="hover:text-blue-500 transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-blue-500 transition-colors">API Reference</Link></li>
                            <li><Link href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-blue-500 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Stay Updated</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Get the latest updates on civic tech and governance.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-3 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                                <Mail className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                        © 2024 Jan-Mitra. Built for Digital India.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-500">
                        <span>v1.0.0 Beta</span>
                        <span>System Status: <span className="text-green-500">Operational</span></span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
    return (
        <Link href={href} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Icon className="w-4 h-4" />
        </Link>
    );
}
