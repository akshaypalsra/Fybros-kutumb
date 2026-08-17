import { cn } from "@/lib/utils";


export const SegmentedTabs = <T extends string>({
  options,
  value,
  onChange,
  counts,
}: {
  options: { key: T; label: string }[]
  value: T
  onChange: (key: T) => void
  counts?: Partial<Record<T, number>>
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => (
      <button
        key={opt.key}
        type="button"
        onClick={() => onChange(opt.key)}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
          value === opt.key
            ? "border-secondary bg-secondary/10 text-secondary"
            : "border-transparent text-muted-foreground hover:bg-muted"
        )}
      >
        {opt.label}
        {counts?.[opt.key] != null ? ` (${counts[opt.key]})` : ""}
      </button>
    ))}
  </div>
)