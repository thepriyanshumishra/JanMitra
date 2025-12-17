"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            theme={theme as any}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-white group-[.toaster]:dark:bg-slate-900 group-[.toaster]:text-slate-950 group-[.toaster]:dark:text-slate-50 group-[.toaster]:border-slate-200 group-[.toaster]:dark:border-slate-800 group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-slate-500 group-[.toast]:dark:text-slate-400",
                    actionButton:
                        "group-[.toast]:bg-slate-900 group-[.toast]:dark:bg-slate-50 group-[.toast]:text-slate-50 group-[.toast]:dark:text-slate-900",
                    cancelButton:
                        "group-[.toast]:bg-slate-100 group-[.toast]:dark:bg-slate-800 group-[.toast]:text-slate-500 group-[.toast]:dark:text-slate-400",
                },
            }}
        />
    );
}
