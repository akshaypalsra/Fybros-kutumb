// common/components/SegmentedControl.tsx
import { Button } from "@/common/components/ui/button";
import { cn } from "@/utils/common.utils";

interface SegmentedControlProps<T extends string> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel?: (option: T) => string;
  counts?: Partial<Record<T, number>>;
  variant?: "pill" | "underline";
  size?: "sm" | "md";
  className?: string;
}

const defaultLabel = (option: string) => option === "ALL" ? "All" : option.charAt(0) + option.slice(1).toLowerCase();

const SIZE_STYLES = {
  sm: { text: "text-xs", pillPadding: "px-2.5 py-0.5", containerGap: "gap-1", underlineGap: "gap-4" },
  md: { text: "text-sm", pillPadding: "px-3 py-1", containerGap: "gap-1.5", underlineGap: "gap-6" },
} as const;

export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  getLabel = defaultLabel,
  counts,
  variant = "pill",
  size = "md",
  className,
}: SegmentedControlProps<T>) => {
  const resolveLabel = (option: T) => {
    const label = getLabel(option);
    const count = counts?.[option];
    return count != null ? `${label} (${count})` : label;
  };

  const { text, pillPadding, containerGap, underlineGap } = SIZE_STYLES[size];

  if (variant === "underline") {
    return (
      <nav className={cn("inline-flex items-center font-medium", underlineGap, text, className)}>
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            variant="ghost"
            onClick={() => onChange(option)}
            className={cn(
              "h-auto rounded-none border-0 bg-transparent px-0 pb-1 font-medium hover:bg-transparent",
              text,
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
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-muted/40 p-1",
        containerGap,
        className,
      )}
    >
      {options.map((option) => (
        <Button
          key={option}
          type="button"
          variant="ghost"
          onClick={() => onChange(option)}
          className={cn(
            "h-auto rounded-full border-0 font-medium capitalize transition-colors",
            text,
            pillPadding,
            value === option
              ? "bg-active text-secondary hover:bg-transparent hover:text-secondary"
              : "bg-transparent font-light text-muted-foreground hover:bg-transparent hover:text-muted-foreground",
          )}
        >
          {resolveLabel(option)}
        </Button>
      ))}
    </div>
  );
};