
import type { Order } from "@/types/order.types"
import { OrderRow } from "./OrderRow"
import { ScrollToTopButton } from "@/common/components/ScrollToTopButton"
import { Heading } from "@/common/components/Heading"

interface OrderListProps {
  groupedByMonth: [string, Order[]][]
}

export const OrderList = ({ groupedByMonth }: OrderListProps) => (
  <div className="flex flex-col gap-8">
    {groupedByMonth.map(([month, monthOrders]) => (
      <div key={month}>
        <Heading
          title={
            <>
              {month}{" "}
              <span className="font-normal text-muted-foreground">
                ({monthOrders.length} Order{monthOrders.length > 1 ? "s" : ""})
              </span>
            </>
          }
        />
        <div className="flex flex-col gap-2.5">
          {monthOrders.map((order) => (
            <OrderRow key={order.docEntry} order={order} />
          ))}
        </div>
      </div>
    ))}

    <ScrollToTopButton />
  </div>
)