import { Skeleton } from "@/common/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-6xl pb-6">

      <div className="flex items-center justify-between py-4">
        <Skeleton className="h-5 w-16 border border-border bg-card" />
        <Skeleton className="h-8 w-32 rounded-md border border-border bg-card" />
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-24 col-span-1 rounded-md border border-border bg-card" />
          <Skeleton className="h-24 col-span-1 rounded-md border border-border bg-card" />
          <Skeleton className="h-24 col-span-1 rounded-md border border-border bg-card" />
        </div>
      </div>

      <div className="mb-6">
        <Skeleton className="h-72 w-full rounded-md border border-border bg-card" />
      </div>

      <div>
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-24 col-span-1 rounded-md border border-border bg-card" />
          <Skeleton className="h-24 col-span-1 rounded-md border border-border bg-card" />
          <Skeleton className="h-24 col-span-1 rounded-md border border-border bg-card" />
        </div>
      </div>
    </div>
  );
}