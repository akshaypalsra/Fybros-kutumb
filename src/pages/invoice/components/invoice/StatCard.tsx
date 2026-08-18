import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  variant?: "default" | "hero";
  className?: string;
}

export function StatCard({ icon, label, value, sublabel, variant = "default", className }: StatCardProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={cn(
        "rounded-2xl p-4",
        isHero ? "bg-destructive text-destructive-foreground" : "border bg-card",
        className
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <p className={cn("text-sm", isHero ? "text-destructive-foreground/90" : "text-muted-foreground")}>
          {label}
        </p>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            isHero ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
          )}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      {sublabel && (
        <p className={cn("mt-1 text-xs", isHero ? "text-destructive-foreground/80" : "text-muted-foreground")}>
          {sublabel}
        </p>
      )}
    </div>
  );
}