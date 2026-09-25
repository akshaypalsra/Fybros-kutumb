import { useUrlPersistedFilters } from "@/hooks/useUrlPersistedFilters";

const arrayField = (param: string) => ({
  param,
  defaultValue: [] as string[],
  parse: (raw: string) => raw.split(",").filter(Boolean),
  serialize: (v: string[]) => (v.length ? v.join(",") : null),
});

const DASHBOARD_FILTER_FIELDS = {
  salesRange: {
    param: "range",
    defaultValue: "QoQ" as "MoM" | "QoQ",
    parse: (raw: string) => raw as "MoM" | "QoQ",
    serialize: (v: "MoM" | "QoQ") => (v !== "QoQ" ? v : null),
  },
  selectedVerticals: arrayField("verticals"),
};

export const useDashboardFiltersState = () => {
  const { values, setters, clearAll, clearFields } = useUrlPersistedFilters(
    "dashboard.filters",
    DASHBOARD_FILTER_FIELDS,
  );

  return {
    salesRange: values.salesRange, setSalesRange: setters.salesRange,
    selectedVerticals: values.selectedVerticals, setSelectedVerticals: setters.selectedVerticals,
    clearAll,
    clearFields,
  };
};