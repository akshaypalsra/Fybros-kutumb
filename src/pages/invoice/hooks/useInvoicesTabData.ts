import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useInvoiceApi } from "@/api/invoice/useInvoiceApi";
import type { Invoice, InvoiceSubTab } from "@/types/invoice.types";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { INVOICE_SUB_TABS } from "@/constants/Constants";
import { useOutstandingSummary } from "../../../hooks/useOutstandingSummary";
import { groupByMonth } from "@/utils/grouping.utils";

interface UseInvoicesTabDataParams {
    businessPartnerId: string;
    enabled: boolean;
    search: string;
    dateFrom: string;
    dateTo: string;
    selectedVerticals: string[];
}

const isInvoiceSubTab = (v: string): v is InvoiceSubTab => INVOICE_SUB_TABS.some((tab) => tab.key === v);

export function useInvoicesTabData({
    businessPartnerId,
    enabled,
    search,
    dateFrom,
    dateTo,
    selectedVerticals,
}: UseInvoicesTabDataParams) {
    const { searchInvoices } = useInvoiceApi();
    const [subTab, setSubTab] = useLocalStorageState<InvoiceSubTab>(
        "invoices.subTab",
        "ALL",
        isInvoiceSubTab
    );

    const trimmedSearch = search.trim();
    const fromDateIso = dateFrom ? new Date(`${dateFrom}T00:00:00.000Z`).toISOString() : undefined;
    const toDateIso = dateTo ? new Date(`${dateTo}T23:59:59.999Z`).toISOString() : undefined;

    const {
        data: outstandingSummary,
        isLoading: isOutstandingLoading,
        isError: isOutstandingError,
    } = useOutstandingSummary(businessPartnerId, enabled);

    const {
        data: invoices,
        isLoading: isInvoiceLoading,
        isError: isInvoiceError,
    } = useQuery<Invoice[]>({
        queryKey: ["invoices", businessPartnerId, trimmedSearch, fromDateIso, toDateIso, selectedVerticals],
        queryFn: () =>
            searchInvoices({
                businessPartnerId,
                query: trimmedSearch || undefined,
                fromDate: fromDateIso,
                toDate: toDateIso,
                verticals: selectedVerticals.length ? selectedVerticals : undefined,
                page: 0,
                size: 100,
            }),
        enabled,
    });

    const isLoading = isInvoiceLoading || isOutstandingLoading;
    const isError = isInvoiceError || isOutstandingError;

    const counts: Partial<Record<InvoiceSubTab, number>> = {
        ALL: (invoices ?? []).length,
        OPEN: (invoices ?? []).filter((i) => i.status !== "PAID").length,
        CLOSED: (invoices ?? []).filter((i) => i.status === "PAID").length,
        OVERDUE: (invoices ?? []).filter((i) => i.status === "OVERDUE").length,
    };

    const filteredInvoices = (invoices ?? []).filter((invoice) => {
        if (subTab === "ALL") return true;
        if (subTab === "OPEN") return invoice.status !== "PAID";
        if (subTab === "CLOSED") return invoice.status === "PAID";
        return invoice.status === "OVERDUE";
    });

  const invoicesByMonth = useMemo(() => groupByMonth(filteredInvoices, (invoice) => invoice.docDate),[filteredInvoices]);

    return {
        outstandingSummary,
        subTab,
        setSubTab,
        counts,
        invoicesByMonth,
        hasResults: filteredInvoices.length > 0,
        isLoading,
        isError,
    };
}