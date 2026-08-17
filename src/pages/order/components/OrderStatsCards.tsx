import { Card, CardContent } from "@/common/components/ui/card"
import type { OrderStats } from "@/types/order.types"
import { formatCompactCurrency, formatCurrency } from "@/utils/orders.utils"

interface OrderStatsCardsProps {
  stats: OrderStats
  orderCount: number
}

export const OrderStatsCards = ({ stats, orderCount }: OrderStatsCardsProps) => (
  <div className="mb-6 grid grid-cols-4 gap-3.5">
    <Card className="border-0 bg-secondary p-5 text-white">
      <CardContent className="p-0">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide opacity-85">
          Total Order Value
        </p>
        <p className="text-2xl font-bold leading-none">{formatCompactCurrency(stats.totalOrderValue)}</p>
        <p className="mt-2 text-[11px] opacity-80">Across all orders</p>
      </CardContent>
    </Card>

    <Card className="border-0 bg-secondary p-5 text-white">
      <CardContent className="p-0">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide opacity-85">Delivered</p>
        <p className="text-2xl font-bold leading-none">{formatCompactCurrency(stats.deliveredOrderValue)}</p>
        <p className="mt-2 text-[11px] opacity-80">Overall delivered value</p>
      </CardContent>
    </Card>

    <Card className="border-border bg-card p-5">
      <CardContent className="p-0">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Open Orders
        </p>
        <p className="text-2xl font-bold leading-none text-foreground">{stats.openCount}</p>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {formatCurrency(stats.openOrderValue)} pending value
        </p>
      </CardContent>
    </Card>

    <Card className="border-border bg-card p-5">
      <CardContent className="p-0">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Avg. Order Size
        </p>
        <p className="text-2xl font-bold leading-none text-foreground">
          {formatCompactCurrency(stats.avgOrderSize)}
        </p>
        <p className="mt-2 text-[11px] text-muted-foreground">Across {orderCount} orders</p>
      </CardContent>
    </Card>
  </div>
)