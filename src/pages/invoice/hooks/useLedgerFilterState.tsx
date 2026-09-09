import { useMemo } from "react"
import { useUrlPersistedFilters } from "@/hooks/useUrlPersistedFilters"
import { toIsoDateRange } from "@/utils/date.utils"

const stringField = (param: string, defaultValue = "") => ({
  param,
  defaultValue,
  parse: (raw: string) => raw,
  serialize: (v: string) => v || null,
})

type SortDirection = "ASC" | "DESC"

const sortDirectionField = (param: string, defaultValue: SortDirection = "DESC") => ({
  param,
  defaultValue,
  parse: (raw: string) => (raw === "DESC" ? "DESC" : "ASC") as SortDirection,
  serialize: (v: SortDirection) => (v !== defaultValue ? v : null),
})

export const useLedgerFilterState = () => {
  const { values, setters, clearAll,clearFields } = useUrlPersistedFilters("ledgers.filters", {
    query: stringField("q"),
    dateFrom: stringField("from"),
    dateTo: stringField("to"),
    sortDirection: sortDirectionField("sort"),
  })

  const { fromDateIso, toDateIso } = useMemo(
    () => toIsoDateRange(values.dateFrom, values.dateTo),
    [values.dateFrom, values.dateTo],
  )

  return {
    query: values.query, setQuery: setters.query,
    dateFrom: values.dateFrom, setDateFrom: setters.dateFrom,
    dateTo: values.dateTo, setDateTo: setters.dateTo,
    fromDateIso, toDateIso,
    sortDirection: values.sortDirection, setSortDirection: setters.sortDirection,
    clearAll,
    clearFields
  }
}