import { X } from "lucide-react"
import type { Vertical } from "@/api/vertical/verticalApi"
import { DateFilter } from "../../../common/components/DateFilter"
import { VerticalFilter } from "../../../common/components/VerticalFilter"
import { SearchBar } from "../../../common/components/SearchBar"
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
}

export const OrderFiltersBar = ({
    query,
    onQueryChange,
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
    verticals,
    selectedVerticals,
    onVerticalsChange,
}: OrderFiltersBarProps) => {
    const hasActiveFilters = !!query || !!dateFrom || !!dateTo || selectedVerticals.length > 0

    const handleClearAll = () => {
        onQueryChange("")
        onDateFromChange("")
        onDateToChange("")
        onVerticalsChange([])
    }

    return (
        <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-50">
                <SearchBar value={query} onChange={onQueryChange} />
            </div>
            <DateFilter
                from={dateFrom}
                to={dateTo}
                onFromChange={onDateFromChange}
                onToChange={onDateToChange}
            />
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
                onClick={handleClearAll}
                className="gap-1 rounded-lg py-4.5 border border-border text-xs font-medium text-muted-foreground hover:text-foreground"
            >
                <X className="h-3.5 w-3.5" />
                Clear all
            </Button>
        </div>
    )
}