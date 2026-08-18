import { Skeleton } from "@/common/components/ui/skeleton";

export function SidebarUserMenuSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2">
      <Skeleton className="h-9 w-9 rounded-full" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}