import { Skeleton } from "@/common/components/ui/skeleton";
import { OrderRowSkeleton } from "./OrderRowSkeleton";

interface OrdersListSkeletonProps {
  rows?: number;
  groups?: number;
}

export const OrdersListSkeleton = ({ rows = 5, groups = 1 }: OrdersListSkeletonProps) => {
  const rowsPerGroup = Math.max(1, Math.ceil(rows / groups));

  return (
    <div className="space-y-6">
      {Array.from({ length: groups }).map((_, groupIdx) => (
        <div key={groupIdx} className="space-y-3">
          <Skeleton className="h-4 w-28 rounded-md border border-border bg-card " />
          {Array.from({ length: rowsPerGroup }).map((_, rowIdx) => (
            <OrderRowSkeleton key={rowIdx} />
          ))}
        </div>
      ))}
    </div>
  );
};