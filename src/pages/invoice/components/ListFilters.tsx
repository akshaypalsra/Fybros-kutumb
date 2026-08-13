import { DATE_PRESETS } from "@/constants/Constants"
import type { DatePreset } from "@/types/invoice.types"
import { ChevronDown, Search, X } from "lucide-react"


export const ListFilters = ({
  search,
  onSearchChange,
  searchPlaceholder,
  datePreset,
  onDatePresetChange,
  verticalFilter,
  onVerticalFilterChange,
  availableVerticals,
}: {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  datePreset: DatePreset
  onDatePresetChange: (preset: DatePreset) => void
  verticalFilter: string
  onVerticalFilterChange: (vertical: string) => void
  availableVerticals: string[]
}) => (
  <div className="mb-5 space-y-3">
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        className="w-full rounded-xl border bg-background py-2.5 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#E92739]/40"
      />
    </div>

    <div className="flex flex-wrap gap-2">
      <div className="relative">
        <select
          value={datePreset}
          onChange={(e) => onDatePresetChange(e.target.value as DatePreset)}
          className="appearance-none rounded-full border bg-background py-1.5 pl-3 pr-8 text-xs font-medium text-foreground outline-none"
        >
          {DATE_PRESETS.map((preset) => (
            <option key={preset.key} value={preset.key}>
              {preset.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      </div>

      <div className="relative">
        <select
          value={verticalFilter}
          onChange={(e) => onVerticalFilterChange(e.target.value)}
          className="appearance-none rounded-full border bg-background py-1.5 pl-3 pr-8 text-xs font-medium text-foreground outline-none"
        >
          <option value="ALL">All Verticals</option>
          {availableVerticals.map((vertical) => (
            <option key={vertical} value={vertical}>
              {vertical}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>

    {(datePreset !== "ALL" || verticalFilter !== "ALL") && (
      <div className="flex flex-wrap gap-2">
        {datePreset !== "ALL" && (
          <button
            type="button"
            onClick={() => onDatePresetChange("ALL")}
            className="flex items-center gap-1 rounded-full bg-[#E92739]/10 px-2.5 py-1 text-xs font-medium text-[#E92739]"
          >
            {DATE_PRESETS.find((p) => p.key === datePreset)?.label}
            <X className="h-3 w-3" />
          </button>
        )}
        {verticalFilter !== "ALL" && (
          <button
            type="button"
            onClick={() => onVerticalFilterChange("ALL")}
            className="flex items-center gap-1 rounded-full bg-[#E92739]/10 px-2.5 py-1 text-xs font-medium text-[#E92739]"
          >
            {verticalFilter}
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    )}
  </div>
)