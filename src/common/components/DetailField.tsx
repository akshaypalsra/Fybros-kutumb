import type { ReactNode } from "react";

interface DetailFieldProps {
  label: string;
  value: ReactNode;
  layout?: "stacked" | "row";
  isFirst?: boolean;
  isLast?: boolean;
}

export function DetailField({ label, value, layout = "stacked", isFirst, isLast }: DetailFieldProps) {
  if (layout === "row") {
    return (
      <div
        className={`flex items-center justify-between py-3 ${isFirst ? "first:pt-0" : ""} ${isLast ? "last:pb-0" : ""
          }`}
      >
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-normal text-foreground">{value ?? "—"}</span>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-normal text-foreground">{value ?? "—"}</p>
    </div>
  );
}