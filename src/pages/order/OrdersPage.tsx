// src/orders/OrdersPage.tsx
import { useOrdersData } from "./hooks/useOrdersData"
import { useOrderStats } from "./hooks/useOrderStats"
import { useOrderFilterState } from "./hooks/useOrderFilterState"
import { useOrderFilters } from "./hooks/useOrderFilters"

import { OrdersHeader } from "./components/OrdersHeader"
import { OrderFiltersBar } from "./components/OrderFiltersBar"
import { OrderStatsCards } from "./components/OrderStatsCards"
import { OrderTabs } from "./components/OrderTabs"
import { OrderList } from "./components/OrderList"
import { OrdersListSkeleton } from "./components/OrdersListSkeleton"
import { useVerticals } from "@/hooks/useVerticals"

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

  const { partner, orders, isLoading, isError } = useOrdersData({
    query,
    dateFrom,
    dateTo,
    selectedVerticals,
  })

  const { verticals } = useVerticals()
  const stats = useOrderStats(orders)
  const { filteredOrders, groupedByMonth } = useOrderFilters(orders, tab)

  const showContent = !isLoading && !isError && orders

  return (
    <div className="mx-auto max-w-295 p-8">
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

      {showContent && <OrderStatsCards stats={stats} orderCount={orders.length} />}

      {showContent && (
        <OrderTabs
          value={tab}
          onChange={setTab}
          allCount={orders.length}
          openCount={stats.openCount}
          closedCount={stats.closedCount}
        />
      )}

      {isLoading && <OrdersListSkeleton rows={5} />}

      {isError && <p className="text-sm text-destructive">Failed to load orders. Please try again.</p>}

      {showContent && filteredOrders.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">No orders match this view.</p>
      )}

      {showContent && filteredOrders.length > 0 && <OrderList groupedByMonth={groupedByMonth} />}
    </div>
  )
}

export default OrdersPage