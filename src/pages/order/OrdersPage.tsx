import { tabToOrderStatus, useOrdersData } from "./hooks/useOrdersData";
import { useOrderFilterState } from "./hooks/useOrderFilterState";
import { useOrderFilters } from "./hooks/useOrderFilters";
import { OrdersHeader } from "./components/order/OrdersHeader";
import { OrderFiltersBar } from "./components/order/OrderFilters";
import { OrderStatsCards } from "./components/order/OrderStatsCards";
import { OrderTabs } from "./components/order/OrderTabs";
import { OrderList } from "./components/order/OrderList";
import { OrdersListSkeleton } from "./components/order/OrdersListSkeleton";

import { useVerticals } from "@/hooks/useVerticals";
import { useInfiniteScrollTrigger } from "@/hooks/useInfiniteScrollTrigger";
import { useOrderApi } from "@/api/order/useOrderApi";
import { useQuery } from "@tanstack/react-query";
import type { Order, OrderValue } from "@/types/order.types";
import { ListStateWrapper } from "@/wrapper/ListStateWrapper";
import { OrdersListError } from "./components/order/OrdersListError";


const OrdersPage = () => {
  const {
    tab,
    setTab,
    query,
    setQuery,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    fromDateIso,
    toDateIso,
    selectedVerticals,
    setSelectedVerticals,
  } = useOrderFilterState();

  const {
    partner,
    orders,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOrdersData({ query, dateFrom, dateTo, selectedVerticals, tab });

  const { getOrderValue } = useOrderApi();
  const { verticals } = useVerticals();
  const { groupedByMonth } = useOrderFilters(orders);

  const { data: orderValue, isLoading: isOrderValueLoading } = useQuery<OrderValue>({
    queryKey: ["order-value", partner?.cardCode, dateFrom, dateTo, query, selectedVerticals, tab],
    queryFn: () =>
      getOrderValue(partner!.cardCode, {
        fromDate: fromDateIso,
        toDate: toDateIso,
        query: query.trim() || undefined,
        verticals: selectedVerticals.length ? selectedVerticals : undefined,
        orderStatus: tabToOrderStatus(tab),
      }),
    enabled: !!partner?.cardCode,
  });

  const sentinelRef = useInfiniteScrollTrigger(
    fetchNextPage,
    !!hasNextPage && !isFetchingNextPage && !isLoading,
  );

  return (
    <div className="mx-auto max-w-295">
      <OrdersHeader partnerName={partner?.cardName} partnerCode={partner?.cardCode} />

      <OrderFiltersBar
        query={query}
        onQueryChange={setQuery}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        verticals={verticals}
        selectedVerticals={selectedVerticals}
        onVerticalsChange={setSelectedVerticals}
      />

      <ListStateWrapper<Order>
        isLoading={isLoading}
        isError={isError}
        data={orders}
        skeleton={<OrdersListSkeleton rows={5} />}
        error={<OrdersListError />}
      >
        {(orders) => (
          <>
            <OrderStatsCards orderValue={orderValue} isOrderValueLoading={isOrderValueLoading} />
            <OrderTabs value={tab} onChange={setTab} />

            {orders.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">No orders match this view.</p>
            ) : (
              <>
                <OrderList groupedByMonth={groupedByMonth} />
                <div ref={sentinelRef} className="h-1" />
                {isFetchingNextPage && <OrdersListSkeleton rows={2} />}
              </>
            )}
          </>
        )}
      </ListStateWrapper>
    </div>
  );
};

export default OrdersPage;