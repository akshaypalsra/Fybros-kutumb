import { X } from "lucide-react"
import { OrderDateFilter } from "./OrderDateFilter"
import { OrderSearchBar } from "./OrderSearchBar"
import { OrderVerticalFilter } from "./OrderVerticalFilter"
import type { Vertical } from "@/api/vertical/verticalApi"

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
                <OrderSearchBar value={query} onChange={onQueryChange} />
            </div>
            <OrderDateFilter
                from={dateFrom}
                to={dateTo}
                onFromChange={onDateFromChange}
                onToChange={onDateToChange}
            />
            <OrderVerticalFilter
                verticals={verticals}
                selected={selectedVerticals}
                onChange={onVerticalsChange}
            />
            {hasActiveFilters && (
                <button
                    type="button"
                    onClick={handleClearAll}
                    className="flex items-center cursor-pointer gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                    <X className="h-3.5 w-3.5" />
                    Clear all
                </button>
            )}
        </div>
    )
}