import { useLedgerApi } from "@/api/transaction/useTransactionApi";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseLedgersParams {
    businessPartnerId: string;
    fromDateIso?: string;
    toDateIso?: string;
    enabled: boolean;
    pageSize?: number;
}

export function useLedgers({
    businessPartnerId,
    fromDateIso,
    toDateIso,
    enabled,
    pageSize = 20,
}: UseLedgersParams) {
    const { getBusinessPartnerLedgers } = useLedgerApi();

    const query = useInfiniteQuery({
        queryKey: ["ledgers", businessPartnerId, fromDateIso, toDateIso],
        queryFn: ({ pageParam = 0 }) =>
            getBusinessPartnerLedgers({
                businessPartnerId,
                fromDate: fromDateIso,
                toDate: toDateIso,
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

    const ledgers = query.data?.pages.flatMap((page) => page.content) ?? [];

    return {
        ledgers,
        isLoading: query.isLoading,
        isError: query.isError,
        isFetchingNextPage: query.isFetchingNextPage,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
    };
}