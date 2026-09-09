import { X, Calendar } from "lucide-react"
import type { Vertical } from "@/api/vertical/verticalApi"
import { DateFilter } from "../../../../common/components/DateFilter"
import { VerticalFilter } from "../../../../common/components/VerticalFilter"
import { SearchBar } from "../../../../common/components/SearchBar"
import { Button } from "@/common/components/ui/button"

interface OrderFiltersBarProps {
    query: string
    onQueryChange: (value: string) => void
    dateFrom: string
    dateTo: string
    onDateFromChange: (value: string) => void
    onDateToChange: (value: string) => void
    verticals: Vertical[]
    selectedVerticals: string[]
    onVerticalsChange: (value: string[]) => void
    clearAll: () => void
    onClearDates: () => void
    dateMode?: "range" | "as-of-today"
}

export const OrderFilters = ({
    query,
    onQueryChange,
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
    verticals,
    selectedVerticals,
    onVerticalsChange,
    clearAll,
    onClearDates,
    dateMode = "range",
}: OrderFiltersBarProps) => {
    const hasActiveFilters = !!query || (dateMode === "range" && (!!dateFrom || !!dateTo)) || selectedVerticals.length > 0

    return (
        <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-50">
                <SearchBar value={query} onChange={onQueryChange} />
            </div>
            {dateMode === "as-of-today" ? (
                <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2.5 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    As of today
                </div>
            ) : (
                <DateFilter
                    from={dateFrom}
                    to={dateTo}
                    onFromChange={onDateFromChange}
                    onToChange={onDateToChange}
                    onClearDates={onClearDates}
                />
            )}
            <VerticalFilter
                verticals={verticals}
                selected={selectedVerticals}
                onChange={onVerticalsChange}
            />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!hasActiveFilters}
                onClick={clearAll}
                className="gap-1 rounded-md py-4.5 border border-border text-xs font-medium text-muted-foreground hover:text-foreground"
            >
                <X className="h-3.5 w-3.5" />
                Clear All
            </Button>
        </div>
    )
}