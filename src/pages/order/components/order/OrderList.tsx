
import type { Order } from "@/types/order.types"
import { OrderRow } from "./OrderRow"
import { ScrollToTopButton } from "@/common/components/ScrollToTopButton"

interface OrderListProps {
  groupedByMonth: [string, Order[]][]
}

export const OrderList = ({ groupedByMonth }: OrderListProps) => (
  <div className="flex flex-col gap-8">
    {groupedByMonth.map(([month, monthOrders]) => (
      <div key={month}>
        <div className="mb-3 flex items-baseline gap-2">
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-foreground">{month}</h3>
          <span className="text-xs text-muted-foreground">
            {monthOrders.length} order{monthOrders.length > 1 ? "s" : ""}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="flex flex-col gap-2.5">
          {monthOrders.map((order) => (
            <OrderRow key={order.docEntry} order={order} />
          ))}
        </div>
      </div>
    ))}

    <ScrollToTopButton/>
  </div>
)