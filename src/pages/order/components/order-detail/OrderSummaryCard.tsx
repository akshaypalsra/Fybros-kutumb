import { Heading } from "@/common/components/Heading";
import type { OrderWithExtras } from "@/types/order-detail.types";
import type { OrderItem } from "@/types/order.types";

interface OrderSummaryCardProps {
    order?: OrderWithExtras;
    items: OrderItem[];
}



export const OrderSummaryCard = ({ order, items }: OrderSummaryCardProps) => {
    if (items.length === 0 || !order) return null;

    return (
        <div className="rounded-md border border-border bg-card p-5 col-span-2">
            <div className="flex items-center justify-between">
                <Heading title="Summary" />
                {order.orderNumber && (
                    <span className="text-xs text-muted-foreground">{order.orderNumber}</span>
                )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md bg-muted border p-3">
                    <p className="text-xs text-muted-foreground">Delivered</p>
                    <p className="text-lg font-bold text-foreground">{order.deliveredQuantity}</p>
                </div>
                <div className="rounded-md bg-muted border  p-3">
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-lg font-bold text-foreground">{order.pendingQuantity}</p>
                </div>
                <div className="rounded-md bg-muted border p-3">
                    <p className="text-xs text-muted-foreground">Cancelled</p>
                    <p className="text-lg font-bold text-foreground">{order.cancelledQuantity}</p>
                </div>
            </div>


        </div>
    );
};