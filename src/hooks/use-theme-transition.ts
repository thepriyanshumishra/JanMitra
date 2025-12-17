"use client";

import { useState, useEffect } from "react";

export type TransitionType = "circular" | "wipe" | "vertical-wipe" | "fade" | "none";

export function useThemeTransition() {
    const [transitionType, setTransitionType] = useState<TransitionType>("circular");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme-transition") as TransitionType;
        if (saved) {
            setTransitionType(saved);
        }
        setMounted(true);

        const handleChange = (e: Event) => {
            const customEvent = e as CustomEvent<TransitionType>;
            setTransitionType(customEvent.detail);
        };

        window.addEventListener("theme-transition-change", handleChange);
        return () => window.removeEventListener("theme-transition-change", handleChange);
    }, []);

    const setType = (type: TransitionType) => {
        setTransitionType(type);
        localStorage.setItem("theme-transition", type);
        window.dispatchEvent(new CustomEvent("theme-transition-change", { detail: type }));
    };

    return { transitionType, setTransitionType: setType, mounted };
}
