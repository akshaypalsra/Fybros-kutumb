import { SearchBar } from "@/common/components/SearchBar";
import { DateFilter } from "@/common/components/DateFilter";
import { Dropdown } from "@/common/components/Dropdown";
import { Button } from "@/common/components/ui/button";
import { X } from "lucide-react";

interface TransactionFiltersProps {
    query: string;
    onQueryChange: (value: string) => void;
    queryPlaceholder?: string;
    fromDate: string;
    toDate: string;
    onFromDateChange: (value: string) => void;
    onToDateChange: (value: string) => void;
    sortDirection: "ASC" | "DESC";
    onSortDirectionChange: (value: "ASC" | "DESC") => void;
    hasActiveFilters: boolean
    onClearAll: () => void
    onClearDates: () => void
}

export const TransactionFilters = ({
    query,
    onQueryChange,
    queryPlaceholder = "Search transactions...",
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange,
    sortDirection,
    onSortDirectionChange,
    hasActiveFilters,
    onClearAll,
    onClearDates
}: TransactionFiltersProps) => {
    return (
        <div className="mb-6 flex flex-col flex-wrap items-center gap-3 md:flex-row">
            <div className="w-full flex-1 md:min-w-55">
                <SearchBar
                    value={query}
                    onChange={onQueryChange}
                    placeholder={queryPlaceholder}
                />
            </div>

            <div className="w-full md:w-auto">
                <DateFilter
                    from={fromDate}
                    to={toDate}
                    onFromChange={onFromDateChange}
                    onToChange={onToDateChange}
                    onClearDates={() => onClearDates()}
                />
            </div>

            <div className="w-full md:w-auto">
                <Dropdown
                    value={sortDirection}
                    onValueChange={onSortDirectionChange}
                    options={[
                        {
                            label: "Oldest First",
                            value: "ASC",
                        },
                        {
                            label: "Newest First",
                            value: "DESC",
                        },
                    ]}
                    align="end"
                    variant="default"
                    className="w-full md:w-auto"
                />
            </div>

            <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!hasActiveFilters}
                onClick={onClearAll}
                className="gap-1 rounded-md py-4.5 border border-border text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-100 disabled:cursor-not-allowed disabled:border-border/50 disabled:text-muted-foreground/40 disabled:hover:text-muted-foreground/40"
            >
                <X className="h-3.5 w-3.5" />
                Clear All
            </Button>
        </div>
    );
};