// pages/home/components/HomeSkeleton.tsx
import { Skeleton } from "@/common/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-6xl pb-6">

      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
      </div>

 
      <div className="mb-6">
        <Skeleton className="mb-3 h-5 w-20" />
        <Skeleton className="mb-3 h-32 w-full rounded-md" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-28 w-full rounded-md" />
          <Skeleton className="h-28 w-full rounded-md" />
        </div>
      </div>


      <div className="mb-6">
        <Skeleton className="mb-3 h-5 w-24" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-28 w-full rounded-md" />
          <Skeleton className="h-28 w-full rounded-md" />
        </div>
      </div>


      <div>
        <Skeleton className="mb-3 h-5 w-32" />
        <Skeleton className="h-72 w-full rounded-md" />
      </div>
    </div>
  );
}