"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 text-center">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Something went wrong!
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                        We apologize for the inconvenience. An unexpected error has occurred.
                    </p>
                    <Button onClick={() => reset()}>Try again</Button>
                </div>
            </body>
        </html>
    );
}
