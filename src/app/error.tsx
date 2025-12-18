'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
            <GlassPanel className="max-w-md w-full p-8 text-center space-y-6 bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Something went wrong!</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        We encountered an unexpected error. Our team has been notified.
                    </p>
                </div>

                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:opacity-90 transition-opacity"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try again
                </button>
            </GlassPanel>
        </div>
    )
}
