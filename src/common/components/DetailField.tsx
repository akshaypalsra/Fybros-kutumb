import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DetailFieldProps {
  label: ReactNode;
  value: ReactNode;
  layout?: "stacked" | "row";
  isFirst?: boolean;
  isLast?: boolean;
  valueClassName?: string;
}

export function DetailField({
  label,
  value,
  layout = "stacked",
  isFirst,
  isLast,
  valueClassName,
}: DetailFieldProps) {
  if (layout === "row") {
    return (
      <div
        className={`flex items-center justify-between py-3 ${isFirst ? "first:pt-0" : ""} ${isLast ? "last:pb-0" : ""
          }`}
      >
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={cn("text-sm font-normal text-foreground", valueClassName)}>{value ?? "—"}</span>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className={cn("text-sm font-normal text-foreground", valueClassName)}>{value ?? "—"}</div>
    </div>
  );
}