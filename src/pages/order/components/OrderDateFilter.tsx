
import { Input } from "@/common/components/ui/input"

interface OrderDateFilterProps {
  from: string
  to: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
}

export const OrderDateFilter = ({ from, to, onFromChange, onToChange }: OrderDateFilterProps) => (
  <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
    <Input
      type="date"
      value={from}
      onChange={(e) => onFromChange(e.target.value)}
      aria-label="From date"
      className="h-auto w-33 bg-white border-0 p-0 text-sm shadow-none focus-visible:ring-0"
    />
    <span className="text-xs text-muted-foreground">to</span>
    <Input
      type="date"
      value={to}
      min={from || undefined}
      onChange={(e) => onToChange(e.target.value)}
      aria-label="To date"
      className="h-auto w-33 bg-white border-0 p-0 text-sm shadow-none focus-visible:ring-0"
    />
    {(from || to) && (
      <button
        type="button"
        onClick={() => {
          onFromChange("")
          onToChange("")
        }}
        className="ml-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        Clear
      </button>
    )}
  </div>
)