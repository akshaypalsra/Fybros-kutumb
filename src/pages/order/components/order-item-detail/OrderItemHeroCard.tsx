import { StatusBadge } from "@/common/components/StatusBadge";
import { formatCurrency } from "@/utils/common.utils";
import type { OrderItemDetail } from "@/types/order.types";

interface OrderItemHeroCardProps {
  item: OrderItemDetail;
}

export function OrderItemHeroCard({ item }: OrderItemHeroCardProps) {
  return (
    <div className="relative overflow-hidden rounded-md bg-linear-to-br from-secondary to-secondary/80 p-6 text-white shadow-md">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />

      <div className="relative mb-4 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-white/60">
            Item Code
          </p>
          <p className="mt-0.5 text-lg font-bold tracking-tight">{item.itemCode}</p>
        </div>
        <StatusBadge status={item.deliveryStatus} className="shrink-0" />
      </div>

      <p className="relative text-sm font-medium text-white/90">{item.itemDescription}</p>
      <p className="relative mt-1 text-xs text-white/60">
        Order {item.orderNumber} &middot; Line {item.lineNumber}
      </p>

      <div className="relative mt-6 flex items-end justify-between border-t border-white/10 pt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-white/60">
          Line Total
        </p>
        <p className="text-2xl font-bold tracking-tight">{formatCurrency(item.lineTotal)}</p>
      </div>
    </div>
  );
}