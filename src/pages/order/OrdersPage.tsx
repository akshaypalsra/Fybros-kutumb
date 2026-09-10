import { useOrdersData } from "./hooks/useOrdersData";
import { usePendingItemsData } from "./hooks/usePendingItemsData";
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
import type { Order, OrderViewMode } from "@/types/order.types";
import type { PendingItem } from "@/types/pending-item.types";
import { QueryState } from "@/wrapper/QueryState";
import { ErrorState } from "@/common/components/ErrorState";
import { EmptyState } from "@/common/components/EmptyState";

import { PendingItemsList } from "./components/pending-item/PendingItemsList";
import { SegmentedControl } from "@/common/components/SegmentedControl";



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

  const {
    pendingItems,
    isLoading: isPendingItemsLoading,
    isError: isPendingItemsError,
    fetchNextPage: fetchNextPendingItemsPage,
    hasNextPage: hasNextPendingItemsPage,
    isFetchingNextPage: isFetchingNextPendingItemsPage,
  } = usePendingItemsData({ query, dateFrom, dateTo, selectedVerticals });

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

  const activeFetchNextPage = isPendingItemsView ? fetchNextPendingItemsPage : fetchNextPage;
  const activeHasNextPage = isPendingItemsView ? hasNextPendingItemsPage : hasNextPage;
  const activeIsFetchingNextPage = isPendingItemsView
    ? isFetchingNextPendingItemsPage
    : isFetchingNextPage;
  const activeIsLoading = isPendingItemsView ? isPendingItemsLoading : isLoading;

  const sentinelRef = useInfiniteScrollTrigger(
    activeFetchNextPage,
    !!activeHasNextPage && !activeIsFetchingNextPage && !activeIsLoading,
  );

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
        <QueryState<PendingItem[]>
          isLoading={isPendingItemsLoading}
          isError={isPendingItemsError}
          data={pendingItems}
          loading={<OrdersListSkeleton rows={5} />}
          error={<ErrorState message="Failed to load pending items. Please try again." />}
          isEmpty={(data) => data.length === 0}
          empty={<EmptyState message="No pending items match with filters." />}
        >
          {() => (
            <>
              <PendingItemsList items={pendingItems} />
              <div ref={sentinelRef} className="h-1" />
              {isFetchingNextPendingItemsPage && <OrdersListSkeleton rows={2} />}
            </>
          )}
        </QueryState>
      ) : (
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
      )}
    </div>
  );
};

export default OrdersPage;