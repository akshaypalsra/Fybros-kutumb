import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInvoiceApi } from "@/api/invoice/useInvoiceApi";
import type { Invoice, InvoiceSubTab } from "@/types/invoice.types";
import { useOutstandingSummary } from "../../../hooks/useOutstandingSummary";
import { groupByMonth } from "@/utils/grouping.utils";

interface UseInvoicesTabDataParams {
  businessPartnerId: string;
  enabled: boolean;
  search: string;
  fromDateIso?: string;
  toDateIso?: string;
  selectedVerticals: string[];
  subTab: InvoiceSubTab;
}

const PAGE_SIZE = 20;

// Maps the UI sub-tab to the backend's invoiceStatus enum.
// "ALL" omits the param entirely so the backend returns every status.
const SUB_TAB_TO_INVOICE_STATUS: Partial<Record<InvoiceSubTab, string>> = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
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
  const { searchInvoices } = useInvoiceApi();

  const trimmedSearch = search.trim();
  const invoiceStatus = SUB_TAB_TO_INVOICE_STATUS[subTab];

  const {
    data: outstandingSummary,
    isLoading: isOutstandingLoading,
    isError: isOutstandingError,
  } = useOutstandingSummary(businessPartnerId, enabled);

  const {
    data,
    isLoading: isInvoiceLoading,
    isError: isInvoiceError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["invoices", businessPartnerId, trimmedSearch, fromDateIso, toDateIso, selectedVerticals, invoiceStatus],
    queryFn: ({ pageParam = 0 }) =>
      searchInvoices({
        businessPartnerId,
        query: trimmedSearch || undefined,
        fromDate: fromDateIso,
        toDate: toDateIso,
        invoiceStatus,
        verticals: selectedVerticals.length ? selectedVerticals : undefined,
        page: pageParam,
        size: PAGE_SIZE,
      }),
    getNextPageParam: (lastPage) => {
      const isLastPage = lastPage.page.number + 1 >= lastPage.page.totalPages;
      return isLastPage ? undefined : lastPage.page.number + 1;
    },
    initialPageParam: 0,
    enabled,
  });

  const invoices: Invoice[] = useMemo(
    () => data?.pages.flatMap((page) => page.content) ?? [],
    [data],
  );

  const isLoading = isInvoiceLoading || isOutstandingLoading;
  const isError = isInvoiceError || isOutstandingError;

  const totalCount = data?.pages[0]?.page.totalElements ?? invoices.length;
  const counts: Partial<Record<InvoiceSubTab, number>> = {
    [subTab]: totalCount,
  };

  const invoicesByMonth = useMemo(
    () => groupByMonth(invoices, (invoice) => invoice.docDate),
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