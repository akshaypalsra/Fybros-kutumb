import { useMemo } from "react";
import type { Invoice, InvoiceSubTab } from "@/types/invoice.types";
import { useOutstandingSummary } from "../../../hooks/useOutstandingSummary";
import { groupByMonth } from "@/utils/grouping.utils";
import { useInvoices } from "./useInvoices";

interface UseInvoicesTabDataParams {
  businessPartnerId: string;
  enabled: boolean;
  search: string;
  fromDateIso?: string;
  toDateIso?: string;
  selectedVerticals: string[];
  subTab: InvoiceSubTab;
}

const SUB_TAB_TO_INVOICE_STATUS: Partial<Record<InvoiceSubTab, string>> = {
  UNPAID: "UNPAID",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
};

export function useInvoicesTabData({
  businessPartnerId,
  enabled,
  search,
  fromDateIso,
  toDateIso,
  selectedVerticals,
  subTab,
}: UseInvoicesTabDataParams) {
  const trimmedSearch = search.trim();
  const invoiceStatus = SUB_TAB_TO_INVOICE_STATUS[subTab];

  const {
    data: outstandingSummary,
    isLoading: isOutstandingLoading,
    isError: isOutstandingError,
  } = useOutstandingSummary(businessPartnerId, enabled);

  const {
    data,
    invoices,
    isLoading: isInvoiceLoading,
    isError: isInvoiceError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInvoices({
    businessPartnerId,
    query: trimmedSearch || undefined,
    fromDate: fromDateIso,
    toDate: toDateIso,
    invoiceStatus,
    verticals: selectedVerticals.length ? selectedVerticals : undefined,
    enabled,
  });

  const isLoading = isInvoiceLoading || isOutstandingLoading;
  const isError = isInvoiceError || isOutstandingError;

  const totalCount = data?.pages[0]?.page?.totalElements ?? invoices.length;
  const counts: Partial<Record<InvoiceSubTab, number>> = {
    [subTab]: totalCount,
  };

  const invoicesByMonth = useMemo(
    () => groupByMonth(invoices as Invoice[], (invoice) => invoice.docDate),
    [invoices],
  );

  return {
    outstandingSummary,
    counts,
    invoicesByMonth,
    hasResults: invoices.length > 0,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}