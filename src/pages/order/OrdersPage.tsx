import { tabToOrderStatus, useOrdersData } from "./hooks/useOrdersData"
import { useOrderFilterState } from "./hooks/useOrderFilterState"
import { useOrderFilters } from "./hooks/useOrderFilters"
import { OrdersHeader } from "./components/OrdersHeader"
import { OrderFiltersBar } from "./components/OrderFiltersBar"
import { OrderStatsCards } from "./components/OrderStatsCards"
import { OrderTabs } from "./components/OrderTabs"
import { OrderList } from "./components/OrderList"
import { OrdersListSkeleton } from "./components/OrdersListSkeleton"
import { useVerticals } from "@/hooks/useVerticals"
import { useInfiniteScrollTrigger } from "@/hooks/useInfiniteScrollTrigger"
import { useOrderApi } from "@/api/order/useOrderApi"
import { useQuery } from "@tanstack/react-query"
import type { OrderValue } from "@/types/order.types"

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
    selectedVerticals,
    setSelectedVerticals,
  } = useOrderFilterState()

  const {
    partner,
    orders,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOrdersData({ query, dateFrom, dateTo, selectedVerticals, tab })

  const { getOrderValue } = useOrderApi()
  const { data: orderValue, isLoading: isOrderValueLoading } = useQuery<OrderValue>({
    queryKey: ["order-value", partner?.cardCode, dateFrom, dateTo, query, selectedVerticals, tab],
    queryFn: () =>
      getOrderValue(partner!.cardCode, {
        fromDate: dateFrom || undefined,
        toDate: dateTo || undefined,
        query: query.trim() || undefined,
        verticals: selectedVerticals.length ? selectedVerticals : undefined,
        orderStatus: tabToOrderStatus(tab),
      }),
    enabled: !!partner?.cardCode,
  })

  const { verticals } = useVerticals()
  const { groupedByMonth } = useOrderFilters(orders)

  const sentinelRef = useInfiniteScrollTrigger(
    fetchNextPage,
    !!hasNextPage && !isFetchingNextPage && !isLoading,
  )

  const showContent = !isLoading && !isError && orders

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

      {showContent && <OrderStatsCards orderValue={orderValue} isOrderValueLoading={isOrderValueLoading} />}

      {showContent && (
        <OrderTabs
          value={tab}
          onChange={setTab}
        />
      )}

      {isLoading && <OrdersListSkeleton rows={5} />}

      {isError && <p className="text-sm text-destructive">Failed to load orders. Please try again.</p>}

      {showContent && orders.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">No orders match this view.</p>
      )}

      {showContent && orders.length > 0 && (
        <>
          <OrderList groupedByMonth={groupedByMonth} />
          <div ref={sentinelRef} className="h-1" />
          {isFetchingNextPage && <OrdersListSkeleton rows={2} />}
        </>
      )}
    </div>
  )
}

export default OrdersPage;