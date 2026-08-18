// pages/order/hooks/useOrderValue.ts
import { useQuery } from "@tanstack/react-query";
import { useOrderApi } from "@/api/order/useOrderApi";
import { tabToOrderStatus } from "./useOrdersData";
import type { OrderValue, TabFilter } from "@/types/order.types";

interface UseOrderValueParams {
    cardCode?: string;
    dateFrom?: string;
    dateTo?: string;
    fromDateIso?: string;
    toDateIso?: string;
    query: string;
    selectedVerticals: string[];
    tab: TabFilter;
}

export function useOrderValue({
    cardCode,
    dateFrom,
    dateTo,
    fromDateIso,
    toDateIso,
    query,
    selectedVerticals,
    tab,
}: UseOrderValueParams) {
    const { getOrderValue } = useOrderApi();

    const { data: orderValue, isLoading: isOrderValueLoading } = useQuery<OrderValue>({
        queryKey: ["order-value", cardCode, dateFrom, dateTo, query, selectedVerticals, tab],
        queryFn: () =>
            getOrderValue(cardCode!, {
                fromDate: fromDateIso,
                toDate: toDateIso,
                query: query.trim() || undefined,
                verticals: selectedVerticals.length ? selectedVerticals : undefined,
                orderStatus: tabToOrderStatus(tab),
            }),
        enabled: !!cardCode,
    });

    return { orderValue, isOrderValueLoading };
}