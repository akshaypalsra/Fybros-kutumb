import { useMemo } from "react";
import { useUrlPersistedFilters } from "@/hooks/useUrlPersistedFilters";
import { toIsoDateRange } from "@/utils/date.utils";
import type { InvoiceSubTab } from "@/types/invoice.types";

const stringField = (param: string, defaultValue = "") => ({
  param,
  defaultValue,
  parse: (raw: string) => raw,
  serialize: (v: string) => v || null,
});

const arrayField = (param: string) => ({
  param,
  defaultValue: [] as string[],
  parse: (raw: string) => raw.split(",").filter(Boolean),
  serialize: (v: string[]) => (v.length ? v.join(",") : null),
});

const INVOICE_FILTER_FIELDS = {
  subTab: {
    param: "tab",
    defaultValue: "ALL" as InvoiceSubTab,
    parse: (raw: string) => raw as InvoiceSubTab,
    serialize: (v: InvoiceSubTab) => (v !== "ALL" ? v : null),
  },
  search: stringField("q"),
  dateFrom: stringField("from"),
  dateTo: stringField("to"),
  selectedVerticals: arrayField("verticals"),
};

export const useListFiltersState = () => {
  const { values, setters, clearAll, clearFields } = useUrlPersistedFilters(
    "invoices.filters",
    INVOICE_FILTER_FIELDS,
  );

  const { fromDateIso, toDateIso } = useMemo(
    () => toIsoDateRange(values.dateFrom, values.dateTo),
    [values.dateFrom, values.dateTo],
  );

  return {
    subTab: values.subTab, setSubTab: setters.subTab,
    search: values.search, setSearch: setters.search,
    dateFrom: values.dateFrom, setDateFrom: setters.dateFrom,
    dateTo: values.dateTo, setDateTo: setters.dateTo,
    fromDateIso, toDateIso,
    selectedVerticals: values.selectedVerticals, setSelectedVerticals: setters.selectedVerticals,
    clearAll,
    clearFields
  };
};