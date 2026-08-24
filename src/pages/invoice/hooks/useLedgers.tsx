import { useLedgerApi } from "@/api/transaction/useTransactionApi";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseLedgersParams {
    businessPartnerId: string;
    query?: string;
    fromDateIso?: string;
    toDateIso?: string;
    sortDirection?: "ASC" | "DESC";
    enabled: boolean;
    pageSize?: number;
}

export function useLedgers({
    businessPartnerId,
    query,
    fromDateIso,
    toDateIso,
    sortDirection = "ASC",
    enabled,
    pageSize = 20,
}: UseLedgersParams) {
    const { getBusinessPartnerLedgers } = useLedgerApi();

    const queryResult = useInfiniteQuery({
        queryKey: [
            "ledgers",
            businessPartnerId,
            query,
            fromDateIso,
            toDateIso,
            sortDirection,
            pageSize,
        ],

        queryFn: ({ pageParam = 0 }) =>
            getBusinessPartnerLedgers({
                businessPartnerId,
                query: query?.trim() || undefined,
                fromDate: fromDateIso,
                toDate: toDateIso,
                sortDirection,
                page: pageParam,
                size: pageSize,
            }),

        getNextPageParam: (lastPage) => {
            const isLastPage =
                lastPage.page.number + 1 >= lastPage.page.totalPages;

            return isLastPage
                ? undefined
                : lastPage.page.number + 1;
        },

        initialPageParam: 0,
        enabled,
    });

    const ledgers =
        queryResult.data?.pages.flatMap((page) => page.content) ?? [];

    return {
        ledgers,
        isLoading: queryResult.isLoading,
        isError: queryResult.isError,
        isFetchingNextPage: queryResult.isFetchingNextPage,
        fetchNextPage: queryResult.fetchNextPage,
        hasNextPage: queryResult.hasNextPage,
    };
}