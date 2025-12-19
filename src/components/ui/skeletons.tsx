import { cn } from "@/lib/utils";

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-slate-200 dark:bg-slate-800", className)}
            {...props}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
            <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-6 w-[60px]" />
                </div>
            </div>
        </div>
    );
}

export function TableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-8 w-[100px]" />
            </div>
            <div className="rounded-md border border-slate-200 dark:border-slate-800">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex gap-4">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[100px]" />
                    </div>
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="p-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                        <div className="flex gap-4">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[100px]" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export { Skeleton };
