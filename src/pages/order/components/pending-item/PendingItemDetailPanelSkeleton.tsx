import { Skeleton } from "@/common/components/ui/skeleton";

const PendingItemDetailPanelSkeleton = () => {
  return (
    <div className="sticky top-20 rounded-md border border-border bg-card mt-7.75">
      <div className="flex flex-col gap-2 border-b border-border p-5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>

      <div className="flex flex-col gap-4 border-b border-border p-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 p-5">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
};

export default PendingItemDetailPanelSkeleton;