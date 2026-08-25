import { Skeleton } from "@/common/components/ui/skeleton";

export const TransactionRowSkeleton = () => {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-card p-4">
      <Skeleton className="h-10 w-10 shrink-0 rounded-full border border-border bg-card"  />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-32 rounded-md border border-border bg-card" />
          <Skeleton className="h-4 w-20 shrink-0 rounded-md border border-border bg-card" />
        </div>
        <Skeleton className="mt-2 h-3 w-48 rounded-md border border-border bg-card" />
      </div>
    </div>
  );
};