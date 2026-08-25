import { Skeleton } from "@/common/components/ui/skeleton";

export const OrderRowSkeleton = () => {
    return (
        <div className="relative grid grid-cols-[180px_2fr_180px] items-start justify-between gap-6 rounded-md border border-border bg-card px-6 py-5">
            <div className="flex min-w-0 items-center gap-3">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full border border-border bg-card" />
                <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-24 rounded-md border border-border bg-card" />
                    <Skeleton className="h-3 w-28 rounded-md border border-border bg-card" />
                </div>
            </div>

            <div className="min-w-0">
                <Skeleton className="mb-2 h-3.5 w-20 rounded-md border border-border bg-card" />
                <Skeleton className="h-2 w-full rounded-full border border-border bg-card" />
            </div>

            <div className="flex flex-col items-end gap-2">
                <Skeleton className="h-4 w-24 rounded-md border border-border bg-card" />
                <Skeleton className="h-3 w-20 rounded-md border border-border bg-card" />
                <Skeleton className="h-5 w-16 rounded-full border border-border bg-card" />
            </div>
        </div>
    );
};