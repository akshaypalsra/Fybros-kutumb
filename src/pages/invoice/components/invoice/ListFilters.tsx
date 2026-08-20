import { X } from "lucide-react"

import type { Vertical } from "@/api/vertical/verticalApi"
import { SearchBar } from "@/common/components/SearchBar"
import { DateFilter } from "@/common/components/DateFilter"
import { VerticalFilter } from "@/common/components/VerticalFilter"
import { Button } from "@/common/components/ui/button"


interface ListFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    searchPlaceholder: string
    dateFrom: string
    dateTo: string
    onDateFromChange: (value: string) => void
    onDateToChange: (value: string) => void
    verticals: Vertical[]
    selectedVerticals: string[]
    onVerticalsChange: (value: string[]) => void
    hasActiveFilters: boolean
    onClearAll: () => void
}

export const ListFilters = ({
    search,
    onSearchChange,
    searchPlaceholder,
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
    verticals,
    selectedVerticals,
    onVerticalsChange,
    hasActiveFilters,
    onClearAll,

}: ListFiltersProps) => {

    return (
        <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="min-w-50 flex-1">
                <SearchBar value={search} onChange={onSearchChange} placeholder={searchPlaceholder} />
            </div>
            <DateFilter from={dateFrom} to={dateTo} onFromChange={onDateFromChange} onToChange={onDateToChange} />
            <VerticalFilter verticals={verticals} selected={selectedVerticals} onChange={onVerticalsChange} />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!hasActiveFilters}
                onClick={onClearAll}
                className="gap-1 rounded-md py-4.5 border border-border text-xs font-medium text-muted-foreground hover:text-foreground"
            >
                <X className="h-3.5 w-3.5" />
                Clear all
            </Button>
        </div>
    )
}