import { Skeleton } from "@/common/components/ui/skeleton";

const InvoiceRowSkeleton = () => (
  <div className="flex mb-2 items-start justify-between gap-4 rounded-md border border-border bg-card px-6 py-5">
    <div className="flex min-w-0 items-start gap-3">
      <Skeleton className="h-9 w-9 shrink-0 rounded-full border border-border bg-card" />
      <div className="min-w-0 space-y-2">
        <Skeleton className="h-4 w-32 border border-border bg-card" />
        <Skeleton className="h-3 w-40 border border-border bg-card" />
        <Skeleton className="h-3 w-24 border border-border bg-card" />
      </div>
    </div>
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-end gap-2">
        <Skeleton className="h-4 w-16 border border-border bg-card" />
        <Skeleton className="h-5 w-14 rounded-full border border-border bg-card" />
      </div>
      <Skeleton className="h-3 w-12" />
    </div>
  </div>
);

export default InvoiceRowSkeleton;