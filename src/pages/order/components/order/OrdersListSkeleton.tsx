import { Skeleton } from "@/common/components/ui/skeleton"

interface OrdersListSkeletonProps {
  rows?: number
}

export const OrdersListSkeleton = ({ rows = 5 }: OrdersListSkeletonProps) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-24 w-full rounded-md" />
    ))}
  </div>
)