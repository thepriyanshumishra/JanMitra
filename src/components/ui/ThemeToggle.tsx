"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { GlassPanel } from "./GlassPanel";
import { useThemeTransition } from "@/hooks/use-theme-transition";

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const { transitionType } = useThemeTransition();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const toggleTheme = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const newTheme = resolvedTheme === "dark" ? "light" : "dark";

        // @ts-ignore
        if (!document.startViewTransition || transitionType === "none") {
            setTheme(newTheme);
            return;
        }

        // @ts-ignore
        const transition = document.startViewTransition(() => {
            setTheme(newTheme);
        });

        await transition.ready;

        const x = e.clientX;
        const y = e.clientY;
        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        );

        const keyframes: Keyframe[] = [];
        const options: KeyframeAnimationOptions = {
            duration: 750,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
        };

        switch (transitionType) {
            case "circular":
                keyframes.push(
                    { clipPath: `circle(0px at ${x}px ${y}px)` },
                    { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` }
                );
                break;
            case "wipe":
                keyframes.push(
                    { clipPath: "inset(0 100% 0 0)" },
                    { clipPath: "inset(0 0 0 0)" }
                );
                break;
            case "vertical-wipe":
                keyframes.push(
                    { clipPath: "inset(100% 0 0 0)" },
                    { clipPath: "inset(0 0 0 0)" }
                );
                break;
            case "fade":
                keyframes.push(
                    { opacity: 0 },
                    { opacity: 1 }
                );
                break;
        }

        if (keyframes.length > 0) {
            document.documentElement.animate(keyframes, options);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-6 right-6 z-50 focus:outline-none"
            aria-label="Toggle Theme"
        >
            <GlassPanel className="p-3 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors">
                <div className="relative w-6 h-6">
                    <Sun className="absolute h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
                    <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
                </div>
            </GlassPanel>
        </button>
    );
}
