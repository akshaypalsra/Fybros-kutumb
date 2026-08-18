import { useState } from "react";
import { useOrdersData } from "./hooks/useOrdersData";
import { useOrderFilterState } from "./hooks/useOrderFilterState";
import { useOrderFilters } from "./hooks/useOrderFilters";
import { useOrderValue } from "./hooks/useOrderValue";
import { OrdersHeader } from "./components/order/OrdersHeader";
import { OrderFiltersBar } from "./components/order/OrderFilters";
import { OrderStatsCards } from "./components/order/OrderStatsCards";
import { OrderTabs } from "./components/order/OrderTabs";
import { OrderList } from "./components/order/OrderList";
import { OrdersListSkeleton } from "./components/order/OrdersListSkeleton";

import { useVerticals } from "@/hooks/useVerticals";
import { useInfiniteScrollTrigger } from "@/hooks/useInfiniteScrollTrigger";
import type { Order } from "@/types/order.types";
import { QueryState } from "@/wrapper/QueryState";
import { ErrorState } from "@/common/components/ErrorState";
import { EmptyState } from "@/common/components/EmptyState";
import { Dropdown } from "@/common/components/Dropdown";

type OrderViewMode = "ORDER" | "ITEM";

const VIEW_MODE_OPTIONS: { label: string; value: OrderViewMode }[] = [
  { label: "Order Wise", value: "ORDER" },
  { label: "Item Wise", value: "ITEM" },
];

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

  const [viewMode, setViewMode] = useState<OrderViewMode>("ORDER");

  const {
    partner,
    orders,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOrdersData({ query, dateFrom, dateTo, selectedVerticals, tab });

  const { verticals } = useVerticals();
  const { groupedByMonth } = useOrderFilters(orders);
  const { orderValue, isOrderValueLoading } = useOrderValue({
    cardCode: partner?.cardCode,
    dateFrom,
    dateTo,
    fromDateIso,
    toDateIso,
    query,
    selectedVerticals,
    tab,
  });

  const sentinelRef = useInfiniteScrollTrigger(
    fetchNextPage,
    !!hasNextPage && !isFetchingNextPage && !isLoading,
  );

  return (
    <div className="mx-auto max-w-295">
      <OrdersHeader partnerName={partner?.cardName} partnerCode={partner?.cardCode} />
      <OrderStatsCards orderValue={orderValue} isOrderValueLoading={isOrderValueLoading} />
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
      <div className="mb-4 flex  gap-3">

        <Dropdown<OrderViewMode>
          options={VIEW_MODE_OPTIONS}
          value={viewMode}
          onValueChange={setViewMode}
          className="rounded-full"
          variant="secondary"
        />
        <OrderTabs value={tab} onChange={setTab} />
      </div>

      <QueryState<Order[]>
        isLoading={isLoading}
        isError={isError}
        data={orders}
        loading={<OrdersListSkeleton rows={5} />}
        error={<ErrorState message="Failed to load orders. Please try again." />}
        isEmpty={(data) => data.length === 0}
        empty={<EmptyState message="No orders match with filters." />}
      >
        {() => (
          <>
            <OrderList groupedByMonth={groupedByMonth} />
            <div ref={sentinelRef} className="h-1" />
            {isFetchingNextPage && <OrdersListSkeleton rows={2} />}
          </>
        )}
      </QueryState>
    </div>
  );
};

export default OrdersPage;