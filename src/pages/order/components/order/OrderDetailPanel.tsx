import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { Order } from "@/types/order.types";
import { FulfillmentBar } from "./FulfillmentBar";
import { StatusBadge } from "@/common/components/StatusBadge";
import { formatCurrency, formatDate } from "@/utils/common.utils";

interface OrderDetailPanelProps {
    order: Order | null;
}

export const OrderDetailPanel = ({ order }: OrderDetailPanelProps) => {
    if (!order) return null;

    const total = order.totalQuantity || order.totalItems || 1;

    return (
        <div className="sticky top-20 rounded-md border border-border bg-card mt-7.75">
            <div className="flex justify-between">
                <div className="flex flex-col border-b border-border p-5">
                    <div className="font-heading text-md text-secondary">Order Details</div>
                    <div className="text-xs">{order.orderNumber}</div>
                </div>

                <Link
                    to={`/orders/${order.docEntry}`}
                    className="flex items-center justify-center gap-1.5 p-4 text-xs font-medium text-foreground transition-colors hover:bg-none"
                >
                    View full order
                    <ExternalLink className="h-3 w-3" />
                </Link>
            </div>

            <div className="flex flex-col gap-4 border-b border-border p-5">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date</span>
                    <span>{formatDate(order.docDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vertical</span>
                    <span>{order.vertical}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <StatusBadge status={order.orderDeliveryStatus} className="font-light" />
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <StatusBadge status={order.orderType} className="font-light uppercase" />
                </div>
            </div>

            <div className="flex flex-col gap-3 border-b border-border p-5">
                <FulfillmentBar
                    delivered={order.deliveredQuantity ?? 0}
                    pending={order.pendingQuantity ?? 0}
                    cancelled={order.cancelledQuantity ?? 0}
                    total={total}
                />
            </div>

            <div className="flex flex-col gap-2 p-5">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Order Total</span>
                    <span className="font-mono font-bold">{formatCurrency(order.docTotal)}</span>
                </div>
                {order.openOrderValue > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pending</span>
                        <span className="font-mono text-[#B4222E]">{formatCurrency(order.openOrderValue)}</span>
                    </div>
                )}
            </div>
        </div>
    );
};