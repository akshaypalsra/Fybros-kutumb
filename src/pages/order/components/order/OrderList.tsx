import type { Order } from "@/types/order.types"
import { OrderRow } from "./OrderRow"
import { ScrollToTopButton } from "@/common/components/ScrollToTopButton"
import { Heading } from "@/common/components/Heading"

interface OrderListProps {
  groupedByMonth: [string, Order[]][]
  selectedOrderId?: number
  onOrderClick?: (order: Order) => void
}

export const OrderList = ({ groupedByMonth, selectedOrderId, onOrderClick }: OrderListProps) => (
  <div className="flex flex-col gap-8">
    {groupedByMonth.map(([month, monthOrders]) => (
      <div key={month}>
        <Heading
          title={
            <>
              {month}{" "}
            </>
          }
        />
        <div className="flex flex-col gap-2.5">
          {monthOrders.map((order) => (
            <OrderRow
              key={order.docEntry}
              order={order}
              isSelected={order.docEntry === selectedOrderId}
              onClick={onOrderClick}
            />
          ))}
        </div>
      </div>
    ))}

    <ScrollToTopButton />
  </div>
)