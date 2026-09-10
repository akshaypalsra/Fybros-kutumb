import { useMemo } from "react"
import { useUrlPersistedFilters } from "@/hooks/useUrlPersistedFilters"
import type { TabFilter } from "@/types/order.types"
import { toIsoDateRange } from "@/utils/date.utils"

type OrderViewMode = "ORDERS" | "PENDING_ITEMS"

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
  const { values, setters, clearAll, clearFields } = useUrlPersistedFilters("orders.filters", {
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
    viewMode: {
      param: "view",
      defaultValue: "ORDERS" as OrderViewMode,
      parse: (raw) => raw as OrderViewMode,
      serialize: (v: OrderViewMode) => (v !== "ORDERS" ? v : null),
    },
  })

  const { fromDateIso, toDateIso } = useMemo(
    () => toIsoDateRange(values.dateFrom, values.dateTo),
    [values.dateFrom, values.dateTo],
  )

  return {
    tab: values.tab, setTab: setters.tab,
    query: values.query, setQuery: setters.query,
    dateFrom: values.dateFrom, setDateFrom: setters.dateFrom,
    dateTo: values.dateTo, setDateTo: setters.dateTo,
    fromDateIso, toDateIso,
    selectedVerticals: values.selectedVerticals, setSelectedVerticals: setters.selectedVerticals,
    viewMode: values.viewMode, setViewMode: setters.viewMode,
    clearAll,
    clearFields,
  }
}