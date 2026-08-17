// src/common/components/SegmentedControl.tsx
import { cn } from "@/utils/orders.utils";
import { Button } from "@/common/components/ui/button";

interface SegmentedControlProps<T extends string> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel?: (option: T) => string;
  counts?: Partial<Record<T, number>>;
  variant?: "pill" | "underline";
  className?: string;
}

const defaultLabel = (option: string) => option === "ALL" ? "All" : option.charAt(0) + option.slice(1).toLowerCase();

export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  getLabel = defaultLabel,
  counts,
  variant = "pill",
  className,
}: SegmentedControlProps<T>) => {
  const resolveLabel = (option: T) => {
    const label = getLabel(option);
    const count = counts?.[option];
    return count != null ? `${label} (${count})` : label;
  };

  if (variant === "underline") {
    return (
      <nav className={cn("inline-flex items-center gap-6 text-sm font-medium", className)}>
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            variant="ghost"
            onClick={() => onChange(option)}
            className={cn(
              "h-auto rounded-none border-0 bg-transparent px-0 pb-1 font-medium hover:bg-transparent",
              value === option
                ? "border-b-2 border-secondary text-secondary hover:text-secondary"
                : "border-0 text-muted-foreground hover:text-foreground",
            )}
          >
            {resolveLabel(option)}
          </Button>
        ))}
      </nav>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 p-1", className)}>
      {options.map((option) => (
        <Button
          key={option}
          type="button"
          variant="ghost"
          onClick={() => onChange(option)}
          className={cn(
            "h-auto rounded-full border-0 px-3 py-1 text-xs font-medium capitalize transition-colors",
            value === option
              ? "bg-secondary text-white hover:bg-secondary hover:text-white"
              : "bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground",
          )}
        >
          {resolveLabel(option)}
        </Button>
      ))}
    </div>
  );
};