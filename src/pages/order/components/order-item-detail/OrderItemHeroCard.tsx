import { StatusBadge } from "@/common/components/StatusBadge";
import { formatCurrency } from "@/utils/common.utils";
import type { OrderItemDetail } from "@/types/order.types";

interface OrderItemHeroCardProps {
  item: OrderItemDetail;
}

export function OrderItemHeroCard({ item }: OrderItemHeroCardProps) {
  return (
    <div className="rounded-xl bg-secondary p-5 text-white shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <p className="text-base font-bold">{item.itemCode}</p>
        <StatusBadge status={item.deliveryStatus} className="shrink-0" />
      </div>
      <p className="text-sm font-medium text-white/90">{item.itemDescription}</p>
      <p className="text-xs text-white/70">
        Order {item.orderNumber} &middot; Line {item.lineNumber}
      </p>
      <p className="mt-4 text-xs text-white/70">Line Total</p>
      <p className="text-2xl font-bold">{formatCurrency(item.lineTotal)}</p>
    </div>
  );
}