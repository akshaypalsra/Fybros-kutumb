import type { Tab } from "@/types/invoice.types";

export const shouldShowListFilters = (tab: Tab) => tab === "invoices" || tab === "ledger";

export const getSearchPlaceholder = (tab: Tab) =>
  tab === "invoices" ? "Search by invoice number..." : "Search by reference or order no.";