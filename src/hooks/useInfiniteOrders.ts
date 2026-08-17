import { useInfiniteQuery } from "@tanstack/react-query";
import { useOrderApi } from "@/api/order/useOrderApi";
import type { SearchOrdersParams } from "@/types/order.types";

const PAGE_SIZE = 20;

export const useInfiniteOrders = (params: Omit<SearchOrdersParams, "page" | "size">, enabled = true) => {
    const { searchOrders } = useOrderApi();

    const query = useInfiniteQuery({
        queryKey: ["orders", params],
        queryFn: ({ pageParam }) =>
            searchOrders({ ...params, page: pageParam, size: PAGE_SIZE }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const { number, totalPages } = lastPage.page ?? {};
            const isLastPage = totalPages == null || (number ?? 0) + 1 >= totalPages;
            return isLastPage ? undefined : (number ?? 0) + 1;
        },

        enabled,
    });

    const orders = query.data?.pages.flatMap((page) => page.content) ?? [];
    return { ...query, orders };
};