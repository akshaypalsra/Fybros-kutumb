import { Skeleton } from "@/common/components/ui/skeleton";

export function OrderDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl pb-24">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-3.5 w-24 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>

      <div className="grid gap-3 lg:grid-cols-4">
        {/* OrderHero */}
        <div className="rounded-md border border-border bg-card p-4 lg:col-span-2">
          <Skeleton className="h-32 w-full rounded-md" />
        </div>

        <div className="rounded-md border border-border bg-card p-4 lg:col-span-2">
          <Skeleton className="h-32 w-full rounded-md" />
        </div>

        <div className="rounded-md border border-border bg-card p-4 lg:col-span-2">
          <Skeleton className="h-32 w-full rounded-md" />
        </div>

        {/* OrderInvoicesCard */}
        <div className="rounded-md border border-border bg-card p-4 lg:col-span-2">
          <Skeleton className="h-32 w-full rounded-md" />
        </div>

        {/* OrderItemsCard: heading + list */}
        <div className="rounded-md border border-border bg-card p-4 lg:col-span-4">
          <Skeleton className="mb-4 h-5 w-32 rounded-md" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-4 w-40 rounded-md" />
                </div>
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}