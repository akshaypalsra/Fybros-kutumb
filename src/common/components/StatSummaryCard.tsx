import type { ReactNode } from "react";
import { Card, CardContent } from "@/common/components/ui/card";
import { Skeleton } from "@/common/components/ui/skeleton";
import { cn } from "@/utils/common.utils";

interface StatSummaryCardProps {
  label: string;
  value: string;
  sublabel?: string;
  icon?: ReactNode;
  isLoading?: boolean;
  variant?: "light" | "dark";
  className?: string;
}

export const StatSummaryCard = ({
  label,
  value,
  sublabel,
  icon,
  isLoading,
  variant = "light",
  className,
}: StatSummaryCardProps) => {
  const isDark = variant === "dark";

  return (
    <Card
      className={cn(
        "rounded-2xl p-5",
        isDark ? "border-0 bg-secondary text-white" : "border-border bg-card",
        className,
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm font-heading",
              isDark ? "text-white/90" : "text-foreground",
            )}
          >
            {label}
          </p>
          {icon && (
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                isDark ? "bg-white text-black" : "bg-muted text-muted-foreground",
              )}
            >
              {icon}
            </div>
          )}
        </div>

        {isLoading ? (
          <Skeleton className={cn("mt-3 h-7 w-24", isDark && "bg-white/20")} />
        ) : (
          <p className="mt-2 text-2xl font-heading leading-none">{value}</p>
        )}

        {sublabel && (
          <p
            className={cn(
              "mt-2 text-xs",
              isDark ? "text-white/80" : "text-muted-foreground",
            )}
          >
            {sublabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
};