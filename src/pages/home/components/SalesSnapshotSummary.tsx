import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { formatCompactCurrency } from "@/utils/common.utils";
import { cn } from "@/lib/utils";

interface SalesSnapshotSummaryProps {
  bookedLastMonth?: number;
  growthPercent?: number;
}

export const SalesSnapshotSummary = ({
  bookedLastMonth,
  growthPercent = 0,
}: SalesSnapshotSummaryProps) => {
  const isPositive = growthPercent >= 0;

  return (
    <>
      <div>
        <p className="text-2xl font-heading text-foreground">
          {formatCompactCurrency(bookedLastMonth)}
        </p>

        <p className="text-sm text-muted-foreground">
          Sales booked last month
        </p>
      </div>

      <div
        className={cn(
          "mb-4 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
          isPositive
            ? "bg-emerald-100 text-emerald-700"
            : "bg-destructive/10 text-destructive"
        )}
      >
        {isPositive ? (
          <ArrowUpRight className="h-3 w-3" />
        ) : (
          <ArrowDownRight className="h-3 w-3" />
        )}

        {Math.abs(growthPercent)}%
      </div>
    </>
  );
};