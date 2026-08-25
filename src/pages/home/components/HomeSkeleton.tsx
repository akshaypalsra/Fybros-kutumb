import { Skeleton } from "@/common/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-6xl pb-6">

      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-full border border-border bg-card" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28 border border-border bg-card" />
            <Skeleton className="h-3 w-16 border border-border bg-card" />
          </div>
        </div>
      </div>


      <div className="mb-6">
        <Skeleton className="mb-3 h-5 w-20 border border-border bg-card" />
        <div className="grid grid-cols-3 gap-3 mb-5">
          <Skeleton className="h-28 col-span-1 rounded-md border border-border bg-card" />
          <Skeleton className="h-28 col-span-1 rounded-md border border-border bg-card" />
          <Skeleton className="h-28 col-span-1 rounded-md border border-border bg-card" />
        </div>
        <Skeleton className="mb-3 h-5 w-20 border border-border bg-card" />
        <div className="grid grid-cols-4 gap-3">
          <Skeleton className="h-28 col-span-1 rounded-md border border-border bg-card" />
          <Skeleton className="h-28 col-span-1 rounded-md border border-border bg-card" />
          <Skeleton className="h-28 col-span-1 rounded-md border border-border bg-card" />
          <Skeleton className="h-28 col-span-1 rounded-md border border-border bg-card" />
        </div>
      </div>

      <div>
        <Skeleton className="mb-3 h-5 w-32 border border-border bg-card" />
        <Skeleton className="h-72 w-full rounded-md border border-border bg-card" />
      </div>
    </div>
  );
}