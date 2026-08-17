// src/orders/components/OrderSummaryCard.tsx
import { Badge } from "@/common/components/ui/badge";
import { formatCurrency, formatDate } from "@/utils/orders.utils";
import type { OrderWithExtras } from "@/types/orderDetail.types";
import type { OrderItem } from "@/types/order.types";

interface ItemCounts {
    delivered: number;
    pending: number;
    cancelled: number;
    deliveredPct: number;
    pendingPct: number;
    cancelledPct: number;
}

interface OrderSummaryCardProps {
    order?: OrderWithExtras;
    items: OrderItem[];
    counts: ItemCounts;
    computedTotal: number | undefined;
}

export const OrderSummaryCard = ({ order, items, counts, computedTotal }: OrderSummaryCardProps) => {
    if (items.length === 0) return null;

    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Summary</h2>
            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Delivered</p>
                    <p className="text-lg font-bold text-foreground">{counts.delivered}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-lg font-bold text-foreground">{counts.pending}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Cancelled</p>
                    <p className="text-lg font-bold text-foreground">{counts.cancelled}</p>
                </div>
            </div>

            <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-emerald-500" style={{ width: `${counts.deliveredPct}%` }} />
                <div className="h-full bg-amber-500" style={{ width: `${counts.pendingPct}%` }} />
                <div className="h-full bg-secondary" style={{ width: `${counts.cancelledPct}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-xs">
                <span className="text-emerald-600">{counts.deliveredPct}% Delivered</span>
                <span className="text-amber-600">{counts.pendingPct}% Pending</span>
                <span className="text-secondary">{counts.cancelledPct}% Cancelled</span>
            </div>

            <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Date</span>
                    <span className="font-medium text-foreground">{formatDate(order?.docDate)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Items</span>
                    <span className="font-medium text-foreground">{items.length}</span>
                </div>
                {order?.orderType && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Order Type</span>
                        <Badge
                            variant="outline"
                            className="rounded-full border-purple-200 bg-purple-100 px-2.5 py-0 text-xs font-semibold text-purple-700"
                        >
                            {order.orderType}
                        </Badge>
                    </div>
                )}
                <div className="flex justify-between border-t border-border pt-2">
                    <span className="font-semibold text-foreground">Order Value</span>
                    <span className="font-semibold text-secondary">{formatCurrency(computedTotal)}</span>
                </div>
                {order?.deliveredValue != null && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivered Order</span>
                        <span className="font-medium text-foreground">{formatCurrency(order.deliveredValue)}</span>
                    </div>
                )}
            </div>
        </div>
    );
};