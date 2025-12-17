"use client";

import { motion } from "framer-motion";

export const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-700 ease-in-out">
            {/* Gradient Mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),rgba(248,250,252,1))] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.5),rgba(2,6,23,1))] transition-colors duration-700" />

            {/* Floating Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 dark:opacity-30 animate-blob transition-all duration-1000 ease-in-out" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-amber-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 dark:opacity-30 animate-blob animation-delay-2000 transition-all duration-1000 ease-in-out" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 dark:opacity-30 animate-blob animation-delay-4000 transition-all duration-1000 ease-in-out" />

            {/* Extra blobs for depth */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-50 dark:opacity-20 animate-pulse transition-all duration-1000 ease-in-out" />
        </div>
    );
};
