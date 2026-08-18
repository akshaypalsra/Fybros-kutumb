import { Inbox, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border bg-card p-10 text-center",
        className
      )}
    >
      <Icon className="mb-1 h-8 w-8 text-muted-foreground/60" aria-hidden="true" />
      {title && <p className="text-sm font-medium text-foreground">{title}</p>}
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}