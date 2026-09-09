import { useState } from "react";
import { useOrdersData } from "./hooks/useOrdersData";
import { useOrderFilterState } from "./hooks/useOrderFilterState";
import { useOrderFilters } from "./hooks/useOrderFilters";
import { useOrderValue } from "./hooks/useOrderValue";
import { OrdersHeader } from "./components/order/OrdersHeader";
import { OrderFilters } from "./components/order/OrderFilters";
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
import { cn } from "@/lib/utils";
import { Button } from "@/common/components/ui/button";

type OrderViewMode = "ORDERS" | "PENDING_ITEMS";

const VIEW_MODE_TABS: { label: string; value: OrderViewMode }[] = [
  { label: "Orders", value: "ORDERS" },
  { label: "Pending items", value: "PENDING_ITEMS" },
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
    clearAll,
    clearFields
  } = useOrderFilterState();

  const [viewMode, setViewMode] = useState<OrderViewMode>("ORDERS");
  const isPendingItemsView = viewMode === "PENDING_ITEMS";

  const {
    partner,
    counts,
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

      <OrderFilters
        query={query}
        onQueryChange={setQuery}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        verticals={verticals}
        selectedVerticals={selectedVerticals}
        onVerticalsChange={setSelectedVerticals}
        clearAll={clearAll}
        onClearDates={() => clearFields(["dateFrom", "dateTo"])}
        dateMode={isPendingItemsView ? "as-of-today" : "range"}
      />

      <div className="mb-4 flex w-fit items-center gap-6 border-b border-border">
  {VIEW_MODE_TABS.map((option) => (
    <Button
      key={option.value}
      type="button"
      variant="ghost"
      onClick={() => setViewMode(option.value)}
      className={cn(
        "relative h-auto rounded-none px-0 pb-2.5 text-sm font-medium hover:bg-transparent",
        viewMode === option.value
          ? "text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-secondary"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
            {option.label}
          </Button>
        ))}
      </div>

      {!isPendingItemsView && (
        <div className="mb-4">
          <OrderTabs counts={counts} value={tab} onChange={setTab} />
        </div>
      )}

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