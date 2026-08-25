import { Skeleton } from "@/common/components/ui/skeleton";

export function OverviewTabSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-4">
      <Skeleton className="h-48 w-full rounded-md border border-border bg-card lg:col-span-2" />
      <Skeleton className="h-48 w-full rounded-md border border-border bg-card lg:col-span-2" />
      <Skeleton className="h-40 w-full rounded-md border border-border bg-card lg:col-span-2" />
      <Skeleton className="h-40 w-full rounded-md border border-border bg-card lg:col-span-2" />
      <Skeleton className="h-64 w-full rounded-md border border-border bg-card lg:col-span-4" />
    </div>
  );
}