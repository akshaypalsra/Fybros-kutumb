import { useMemo } from "react"
import { useUrlPersistedFilters } from "@/hooks/useUrlPersistedFilters"
import type { TabFilter } from "@/types/order.types"

const stringField = (param: string, defaultValue = "") => ({
  param,
  defaultValue,
  parse: (raw: string) => raw,
  serialize: (v: string) => v || null,
})

const arrayField = (param: string) => ({
  param,
  defaultValue: [] as string[],
  parse: (raw: string) => raw.split(",").filter(Boolean),
  serialize: (v: string[]) => (v.length ? v.join(",") : null),
})

export const useOrderFilterState = () => {
  const { values, setters, clearAll } = useUrlPersistedFilters("orders.filters", {
    tab: {
      param: "tab",
      defaultValue: "ALL" as TabFilter,
      parse: (raw) => raw as TabFilter,
      serialize: (v) => (v !== "ALL" ? v : null),
    },
    query: stringField("q"),
    dateFrom: stringField("from"),
    dateTo: stringField("to"),
    selectedVerticals: arrayField("verticals"),
  })

  const fromDateIso = useMemo(
    () => (values.dateFrom ? new Date(`${values.dateFrom}T00:00:00.000Z`).toISOString() : undefined),
    [values.dateFrom]
  )
  const toDateIso = useMemo(
    () => (values.dateTo ? new Date(`${values.dateTo}T23:59:59.999Z`).toISOString() : undefined),
    [values.dateTo]
  )

  return {
    tab: values.tab, setTab: setters.tab,
    query: values.query, setQuery: setters.query,
    dateFrom: values.dateFrom, setDateFrom: setters.dateFrom,
    dateTo: values.dateTo, setDateTo: setters.dateTo,
    fromDateIso, toDateIso,
    selectedVerticals: values.selectedVerticals, setSelectedVerticals: setters.selectedVerticals,
    clearAll,
  }
}