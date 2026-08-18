import { Link } from "react-router-dom"
import { FulfillmentBar } from "./FulfillmentBar"
import type { Order } from "@/types/order.types"
import { formatCurrency, formatDate } from "@/utils/common.utils"
import { StatusBadge } from "@/common/components/StatusBadge"

interface OrderRowProps {
    order: Order
}

export const OrderRow = ({ order }: OrderRowProps) => {
    const total = order.totalQuantity || order.totalItems || 1

    return (
        <Link
            to={`/orders/${order.docEntry}`}
            className="relative grid grid-cols-[150px_1.4fr_1fr_170px_120px] items-center gap-5 rounded-xl border border-border bg-card px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="min-w-0">
                <p className="truncate font-mono text-[13px] font-semibold text-foreground">
                    #{order.orderNumber}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{formatDate(order.docDate)}</p>
            </div>

            <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                    {order.vertical || order.cardName || order.cardCode}
                </p>
                <p className="text-[11px] text-muted-foreground">{order.totalItems} items</p>
            </div>

            <FulfillmentBar
                delivered={order.deliveredQuantity}
                pending={order.pendingQuantity}
                cancelled={order.cancelledQuantity}
                total={total}
            />

            <div className="text-right">
                <p className="font-mono text-[15px] font-bold text-foreground">
                    {formatCurrency(order.docTotal)}
                </p>
                {order.openOrderValue > 0 && (
                    <p className="mt-0.5 text-[11px] font-semibold text-[#B4222E]">
                        {formatCurrency(order.openOrderValue)} open
                    </p>
                )}
            </div>

            <div className="flex flex-col items-end gap-1.5">
                <StatusBadge status={order.orderDeliveryStatus} variant="rail" />
            </div>
        </Link>
    )
}