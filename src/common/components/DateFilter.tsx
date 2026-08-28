import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { Button } from "@/common/components/ui/button"
import { Calendar } from "@/common/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/common/components/ui/popover"
import { cn } from "@/lib/utils"

interface DateFilterProps {
  from: string
  to: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  onClearDates?: () => void
}

const toDate = (value: string) => (value ? new Date(value) : undefined)
const toValue = (date: Date | undefined) => (date ? format(date, "yyyy-MM-dd") : "")

export const DateFilter = ({ from, to, onFromChange, onToChange, onClearDates }: DateFilterProps) => {
  const [fromOpen, setFromOpen] = useState(false)
  const [toOpen, setToOpen] = useState(false)
  const fromDate = toDate(from)
  const handleClear = () => {
    onFromChange("")
    onToChange("")
    onClearDates?.()
  }

  return (
    <div className="inline-flex items-center rounded-md border border-border bg-card px-1 py-0.5">
      <Popover open={fromOpen} onOpenChange={setFromOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 gap-2 rounded-md px-3 text-sm font-normal transition-colors",
              "hover:bg-muted",
              from ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <CalendarIcon size={14} className="text-muted-foreground" />
            {from ? format(toDate(from)!, "d MMM yyyy") : "From Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={toDate(from)}
            onSelect={(date) => {
              onFromChange(toValue(date))
              setFromOpen(false)
            }}

          />
        </PopoverContent>
      </Popover>

      <span className="mx-0.5 h-4 w-px shrink-0 bg-border" />

      <Popover open={toOpen} onOpenChange={setToOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 gap-2 rounded-md px-3 text-sm font-normal transition-colors",
              "hover:bg-muted",
              to ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <CalendarIcon size={14} className="text-muted-foreground" />
            {to ? format(toDate(to)!, "d MMM yyyy") : "To Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={toDate(to)}
            onSelect={(date) => {
              onToChange(toValue(date))
              setToOpen(false)
            }}
            disabled={fromDate ? { before: fromDate } : undefined}

          />
        </PopoverContent>
      </Popover>

      {(from || to) && (
        <>
          <span className="mx-0.5 h-4 w-px shrink-0 bg-border" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 gap-1 rounded-md px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={12} />
            Clear
          </Button>
        </>
      )}
    </div>
  )
}