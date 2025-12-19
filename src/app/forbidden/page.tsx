import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 text-center">
            <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mb-6">
                <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Access Denied
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                You do not have permission to view this page. Please contact your administrator if you believe this is an error.
            </p>
            <Link href="/dashboard">
                <Button>Return to Dashboard</Button>
            </Link>
        </div>
    );
}
