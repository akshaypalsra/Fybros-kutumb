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
        queryKey: ["invoices", businessPartnerId, fromDate, toDate, query, invoiceStatus, verticals],
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
            const isLastPage = lastPage.page.number + 1 >= lastPage.page.totalPages;
            return isLastPage ? undefined : lastPage.page.number + 1;
        },
        initialPageParam: 0,
        enabled,
    });

    const invoices = result.data?.pages.flatMap((page) => page.content) ?? [];

    return {
        invoices,
        isLoading: result.isLoading,
        isError: result.isError,
        fetchNextPage: result.fetchNextPage,
        hasNextPage: result.hasNextPage,
        isFetchingNextPage: result.isFetchingNextPage,
    };
}