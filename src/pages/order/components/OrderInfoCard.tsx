
import type { OrderWithExtras } from "@/types/orderDetail.types";

interface OrderInfoCardProps {
  order: OrderWithExtras;
}

export const OrderInfoCard = ({ order }: OrderInfoCardProps) => {
  if (!order.cardName) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold text-foreground">Order Details</h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">Buyer</p>
          <p className="text-sm font-medium text-foreground">{order.cardName}</p>
        </div>
        {order.cardCode && (
          <div>
            <p className="text-xs text-muted-foreground">Card Code</p>
            <p className="text-sm font-medium text-foreground">{order.cardCode}</p>
          </div>
        )}
      </div>
    </div>
  );
};