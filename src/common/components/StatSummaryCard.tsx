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
  variant?: "light" | "accent";
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
  const isAccent = variant === "accent";

  return (
    <Card
      className={cn(
        "rounded-2xl p-5",
        isAccent
          ? "border-0 bg-secondary text-white dark:shadow-lg dark:shadow-black/30"
          : "border-border bg-card text-card-foreground",
        className,
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm font-heading",
              isAccent ? "text-white/90" : "text-foreground",
            )}
          >
            {label}
          </p>
          {icon && (
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                isAccent
                  ? "bg-white text-black"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {icon}
            </div>
          )}
        </div>

        {isLoading ? (
          <Skeleton
            className={cn("mt-3 h-7 w-24", isAccent ? "bg-white/20" : "bg-muted")}
          />
        ) : (
          <p
            className={cn(
              "mt-2 text-2xl font-heading leading-none",
              isAccent ? "text-white" : "text-foreground",
            )}
          >
            {value}
          </p>
        )}

        {sublabel && (
          <p
            className={cn(
              "mt-2 text-xs",
              isAccent ? "text-white/80" : "text-muted-foreground",
            )}
          >
            {sublabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
};