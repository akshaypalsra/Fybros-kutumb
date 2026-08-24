import { useInfiniteQuery } from "@tanstack/react-query";
import { useInvoiceApi } from "@/api/invoice/useInvoiceApi";
import type { SearchInvoicesFilters } from "@/types/invoice.types";

interface UseInvoicesParams extends SearchInvoicesFilters {
    businessPartnerId: string;
    enabled: boolean;
    pageSize?: number;
}

export function useInvoices({
    businessPartnerId,
    fromDate,
    toDate,
    query,
    invoiceStatus,
    verticals,
    enabled,
    pageSize = 20,
}: UseInvoicesParams) {
    const { searchInvoices } = useInvoiceApi();

    const result = useInfiniteQuery({
        queryKey: ["invoices", businessPartnerId, fromDate, toDate, query, invoiceStatus, verticals, pageSize],
        queryFn: ({ pageParam = 0 }) =>
            searchInvoices({
                businessPartnerId,
                fromDate,
                toDate,
                query,
                invoiceStatus,
                verticals,
                page: pageParam,
                size: pageSize,
            }),
        getNextPageParam: (lastPage) => {
            const pageInfo = lastPage?.page;
            if (!pageInfo) {
                console.warn("[useInvoices] lastPage.page is missing — check searchInvoices' response shape.", lastPage);
            }

            const { number, totalPages } = pageInfo ?? {};
            if (number == null || totalPages == null) return undefined;

            return number + 1 >= totalPages ? undefined : number + 1;
        },
        initialPageParam: 0,
        enabled,
    });

    const invoices = result.data?.pages.flatMap((page) => page.content) ?? [];

    return {
        ...result,
        invoices,
    };
}