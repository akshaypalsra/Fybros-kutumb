import { useInfiniteQuery } from "@tanstack/react-query";
import { useOrderApi } from "@/api/order/useOrderApi";
import type { SearchPendingItemsParams } from "@/types/pending-item.types";

const PAGE_SIZE = 20;

export const useInfinitePendingItems = (
    params: Omit<SearchPendingItemsParams, "page" | "size">,
    enabled = true,
) => {
    const { searchPendingItems } = useOrderApi();
    const query = useInfiniteQuery({
        queryKey: ["pending-items", params],
        queryFn: ({ pageParam }) => searchPendingItems({ ...params, page: pageParam, size: PAGE_SIZE }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const pageInfo = lastPage.page ?? lastPage;
            const { number, totalPages } = pageInfo ?? {};

            if (number == null || totalPages == null) return undefined;

            const isLastPage = number + 1 >= totalPages;
            return isLastPage ? undefined : number + 1;
        },
        enabled,
    });

    const pendingItems = query.data?.pages.flatMap((page) => page.content) ?? [];
    return { ...query, pendingItems };
};