// src/orders/components/OrderStatsCards.tsx
import { Card, CardContent } from "@/common/components/ui/card"
import { Skeleton } from "@/common/components/ui/skeleton"
import type { OrderValue } from "@/types/order.types"
import { formatCompactCurrency, formatCurrency } from "@/utils/common.utils"


interface OrderStatsCardsProps {
  orderValue?: OrderValue
  isOrderValueLoading: boolean
}

export const OrderStatsCards = ({
  orderValue,
  isOrderValueLoading,
}: OrderStatsCardsProps) => (
  <div className="mb-6 grid grid-cols-3 gap-3.5">
    <Card className="border-0 bg-secondary p-5 text-white">
      <CardContent className="p-0">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide opacity-85">
          Total Order Value
        </p>
        {isOrderValueLoading ? (
          <Skeleton className="h-7 w-24 bg-white/20" />
        ) : (
          <p className="text-2xl font-bold leading-none">
            {formatCompactCurrency(orderValue?.orderValue ?? 0)}
          </p>
        )}
        <p className="mt-2 text-[11px] opacity-80">Across all orders</p>
      </CardContent>
    </Card>

    <Card className="border-0 bg-secondary p-5 text-white">
      <CardContent className="p-0">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide opacity-85">Delivered</p>
        {isOrderValueLoading ? (
          <Skeleton className="h-7 w-24 bg-white/20" />
        ) : (
          <p className="text-2xl font-bold leading-none">
            {formatCompactCurrency(orderValue?.deliveredOrderValue ?? 0)}
          </p>
        )}
        <p className="mt-2 text-[11px] opacity-80">Overall delivered value</p>
      </CardContent>
    </Card>

    <Card className="border-border bg-card p-5">
      <CardContent className="p-0">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Open Orders
        </p>
        {isOrderValueLoading ? (
          <Skeleton className="h-4 w-28" />
        ) : (
          <p className="mt-2 text-[11px] text-muted-foreground">
            {formatCurrency(orderValue?.pendingOrderValue ?? 0)} pending value
          </p>
        )}
      </CardContent>
    </Card>


  </div>
)