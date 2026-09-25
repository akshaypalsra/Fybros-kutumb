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
import { OrderDetailPanel } from "./components/order/OrderDetailPanel";

import { OrdersListSkeleton } from "./components/order/OrdersListSkeleton";

import { useVerticals } from "@/hooks/useVerticals";
import { useInfiniteScrollTrigger } from "@/hooks/useInfiniteScrollTrigger";
import type { Order, OrderViewMode } from "@/types/order.types";
import { QueryState } from "@/wrapper/QueryState";
import { ErrorState } from "@/common/components/ErrorState";
import { EmptyState } from "@/common/components/EmptyState";

import { SegmentedControl } from "@/common/components/SegmentedControl";
import { useEffect } from "react";
import { PendingItemsTab } from "./components/pending-item/PendingItemsTab";
import PendingItemDetailPanelSkeleton from "./components/pending-item/PendingItemDetailPanelSkeleton";


const VIEW_MODE_TABS: { key: OrderViewMode; label: string }[] = [
  { key: "ORDERS", label: "Orders" },
  { key: "PENDING_ITEMS", label: "Pending items" },
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
    clearFields,
    viewMode,
    setViewMode,
  } = useOrderFilterState();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  useEffect(() => {
    if (isPendingItemsView || isLoading) return;

    if (orders.length === 0) {
      setSelectedOrder(null);
      return;
    }

    const selectionStillValid = orders.some((o) => o.docEntry === selectedOrder?.docEntry);

    if (!selectedOrder || !selectionStillValid) {
      setSelectedOrder(orders[0]);
    }
  }, [orders, isLoading, isPendingItemsView]);

  return (
    <div className="mx-auto max-w-295">
      <OrdersHeader partnerName={partner?.cardName} partnerCode={partner?.cardCode} />

      <div className="mb-4 w-fit">
        <SegmentedControl
          variant="underline"
          options={VIEW_MODE_TABS.map((t) => t.key)}
          value={viewMode}
          onChange={setViewMode}
          getLabel={(key) => VIEW_MODE_TABS.find((t) => t.key === key)?.label ?? key}
        />
      </div>


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

      {!isPendingItemsView && (<OrderStatsCards orderValue={orderValue} isOrderValueLoading={isOrderValueLoading} />)}

      {!isPendingItemsView && (
        <div className="mb-4">
          <OrderTabs counts={counts} value={tab} onChange={setTab} />
        </div>
      )}

      {isPendingItemsView ? (
        <PendingItemsTab
          query={query}
          dateFrom={dateFrom}
          dateTo={dateTo}
          selectedVerticals={selectedVerticals}
        />
      ) : (
        <QueryState<Order[]>
          isLoading={isLoading}
          isError={isError}
          data={orders}
          loading={
            <div className="flex gap-6">
              <div className="w-[60%]">
                <OrdersListSkeleton rows={5} />
              </div>
              <div className="w-[40%]">
                <PendingItemDetailPanelSkeleton />
              </div>
            </div>
          }
          error={<ErrorState message="Failed to load orders. Please try again." />}
          isEmpty={(data) => data.length === 0}
          empty={<EmptyState message="No orders match with filters." />}
        >
          {() => (
            <div className="flex gap-6">
              <div className="w-[60%]">
                <OrderList
                  groupedByMonth={groupedByMonth}
                  selectedOrderId={selectedOrder?.docEntry}
                  onOrderClick={setSelectedOrder}
                />
                <div ref={sentinelRef} className="h-1" />
                {isFetchingNextPage && <OrdersListSkeleton rows={2} />}
              </div>

              {selectedOrder && (
                <div className="w-[40%]">
                  <OrderDetailPanel order={selectedOrder} />
                </div>
              )}
            </div>
          )}
        </QueryState>
      )}
    </div>
  );
};

export default OrdersPage;