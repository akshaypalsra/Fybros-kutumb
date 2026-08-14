import { Search } from "lucide-react"
import { Input } from "@/common/components/ui/input"
import { useEffect, useState } from "react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search by order no., product, invoice number...",
  debounceMs = 400,
}: SearchBarProps) => {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localValue !== value) onChange(localValue)
    }, debounceMs)

    return () => clearTimeout(timeout)
  }, [localValue, debounceMs])

  return (
    <div className=" flex flex-wrap gap-3">
      <div className="relative min-w-65 flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border-border bg-card py-2.5 pl-10 pr-3.5 text-sm focus-visible:border-[#E92739] focus-visible:ring-2 focus-visible:ring-[#FDE9EB]"
        />
      </div>
    </div>
  )
}