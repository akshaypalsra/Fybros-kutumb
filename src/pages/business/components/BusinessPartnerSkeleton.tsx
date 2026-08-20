import { Skeleton } from "@/common/components/ui/skeleton";

export const BusinessPartnerSkeleton = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Skeleton className="h-40 w-full rounded-md" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-md" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-md" />
    </div>
  );
};

export default BusinessPartnerSkeleton;