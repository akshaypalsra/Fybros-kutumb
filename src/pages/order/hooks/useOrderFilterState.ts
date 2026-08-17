// src/orders/hooks/useOrderFilterState.ts
import { useMemo, useState } from "react"
import type { TabFilter } from "@/types/order.types"

export const useOrderFilterState = () => {
  const [tab, setTab] = useState<TabFilter>("ALL")
  const [query, setQuery] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedVerticals, setSelectedVerticals] = useState<string[]>([])

  const fromDateIso = useMemo(
    () => (dateFrom ? new Date(`${dateFrom}T00:00:00.000Z`).toISOString() : undefined),
    [dateFrom],
  )
  const toDateIso = useMemo(
    () => (dateTo ? new Date(`${dateTo}T23:59:59.999Z`).toISOString() : undefined),
    [dateTo],
  )

  return {
    tab,
    setTab,
    query,
    setQuery,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    fromDateIso,
    toDateIso,
    selectedVerticals,
    setSelectedVerticals,
  }
}