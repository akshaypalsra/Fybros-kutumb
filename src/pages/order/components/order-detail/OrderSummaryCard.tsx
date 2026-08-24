

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

    items: OrderItem[];
    counts: ItemCounts;

}

export const OrderSummaryCard = ({ items, counts }: OrderSummaryCardProps) => {
    if (items.length === 0) return null;

    return (
        <div className="rounded-md border border-border bg-card p-5 col-span-2">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Summary</h2>
            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Delivered</p>
                    <p className="text-lg font-bold text-foreground">{counts.delivered}</p>
                </div>
                <div className="rounded-md bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-lg font-bold text-foreground">{counts.pending}</p>
                </div>
                <div className="rounded-md bg-muted/50 p-3">
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


        </div>
    );
};