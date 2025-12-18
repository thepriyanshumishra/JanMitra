"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

export function GoogleTranslate() {
    useEffect(() => {
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    autoDisplay: false,
                    includedLanguages: "en,hi,kn,bn,te,mr,ta,ur,gu,ml,pa,or,as,mai,sat,ks,ne,sd,kok,doi,mni,bho,raj,awa,mag,chat,hary,marw,tulu,sa", // Add all 30+ languages here
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                },
                "google_translate_element"
            );
        };

        const script = document.createElement("script");
        script.src =
            "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div
            id="google_translate_element"
            className="fixed bottom-4 right-4 z-50 opacity-0 pointer-events-none"
        />
    );
}
