import { useState } from "react"
import type { TabFilter } from "@/types/order.types"

export const useOrderFilterState = () => {
  const [tab, setTab] = useState<TabFilter>("ALL")
  const [query, setQuery] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedVerticals, setSelectedVerticals] = useState<string[]>([])

  return {
    tab,
    setTab,
    query,
    setQuery,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    selectedVerticals,
    setSelectedVerticals,
  }
}