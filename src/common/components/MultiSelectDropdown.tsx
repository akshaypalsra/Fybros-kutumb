import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/common/components/ui/popover"
import { Checkbox } from "@/common/components/ui/checkbox"
import { Button } from "@/common/components/ui/button"

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  getLabel?: (selectedOptions: MultiSelectOption[], placeholder: string) => string
  align?: "start" | "center" | "end"
  contentClassName?: string
  triggerClassName?: string
}

const defaultGetLabel = (selectedOptions: MultiSelectOption[], placeholder: string) => {
  if (selectedOptions.length === 0) return placeholder
  if (selectedOptions.length === 1) return selectedOptions[0].label
  return `${selectedOptions.length} selected`
}

export const MultiSelectDropdown = ({
  options,
  selected,
  onChange,
  placeholder = "All",
  getLabel = defaultGetLabel,
  align = "end",
  contentClassName = "w-56 p-2",
  triggerClassName = "",
}: MultiSelectDropdownProps) => {
  const [open, setOpen] = useState(false)

  if (options.length === 0) return null

  const toggle = (value: string) => {
    onChange(
      selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
    )
  }

  const selectedOptions = options.filter((o) => selected.includes(o.value))
  const label = getLabel(selectedOptions, placeholder)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={`h-auto gap-1.5 rounded-md border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground ${triggerClassName}`}
        >
          {label}
          <ChevronDown
            className={`size-4 text-muted-foreground transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        avoidCollisions
        collisionPadding={16}
        className={`max-w-[calc(100vw-2rem)] ${contentClassName}`}
      >
        <div className="flex max-h-64 flex-col gap-0.5 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
            >
              <Checkbox
                checked={selected.includes(option.value)}
                onCheckedChange={() => toggle(option.value)}
              />
              <span className="truncate">{option.label}</span>
            </label>
          ))}
        </div>
        {selected.length > 0 && (
          <Button
            type="button"
            onClick={() => onChange([])}
            className="mt-2 cursor-pointer w-full bg-secondary/10 hover:bg-secondary/20 text-black rounded-md px-2 py-1.5 text-left text-xs font-medium "
          >
            Clear selection
          </Button>
        )}
      </PopoverContent>
    </Popover>
  )
}