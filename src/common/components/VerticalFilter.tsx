import { MultiSelectDropdown } from "@/common/components/MultiSelectDropdown"
import type { Vertical } from "@/api/vertical/verticalApi"

interface VerticalFilterProps {
  verticals: Vertical[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export const VerticalFilter = ({ verticals, selected, onChange }: VerticalFilterProps) => (
  <MultiSelectDropdown
    options={verticals.map((v) => ({ value: v.code, label: v.displayName }))}
    selected={selected}
    onChange={onChange}
    placeholder="All Verticals"
    getLabel={(selectedOptions, placeholder) =>
      selectedOptions.length === 0
        ? placeholder
        : selectedOptions.length === 1
          ? selectedOptions[0].label
          : `${selectedOptions.length} Verticals`
    }
  />
)