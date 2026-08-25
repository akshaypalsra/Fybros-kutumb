import { Skeleton } from "@/common/components/ui/skeleton";

const InvoiceDetailPanelSkeleton = () => (
    <div className="sticky top-20 rounded-md border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-1.5 border-b border-border pb-3">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-48" />
        </div>

        <div className="mb-4 flex items-center gap-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-24" />
        </div>

        <div className="grid grid-cols-2 rounded-md bg-muted p-4 gap-x-4 gap-y-3">
            <div className="space-y-1.5">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
            </div>
        </div>

        <div className="mt-4 flex justify-between border-t border-border pt-3">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-5 w-20" />
        </div>

        <Skeleton className="mt-4 h-9 w-full rounded-md" />
    </div>
);


export default InvoiceDetailPanelSkeleton;