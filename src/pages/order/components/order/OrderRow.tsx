import { Package } from "lucide-react";
import { FulfillmentBar } from "./FulfillmentBar";
import type { Order } from "@/types/order.types";
import { formatCurrency, formatDate } from "@/utils/common.utils";
import { StatusBadge } from "@/common/components/StatusBadge";
import { cn } from "@/utils/common.utils";

interface OrderRowProps {
  order: Order;
  isSelected?: boolean;
  onClick?: (order: Order) => void;
}

export const OrderRow = ({ order, isSelected, onClick }: OrderRowProps) => {
  const total = order.totalQuantity || order.totalItems || 1;
  const delivered = order.deliveredQuantity ?? 0;
  const pending = order.pendingQuantity ?? 0;
  const cancelled = order.cancelledQuantity ?? 0;

  return (
    <button
      type="button"
      onClick={() => onClick?.(order)}
      className="block w-full cursor-pointer appearance-none border-0 bg-transparent p-0 m-0 text-left font-inherit leading-normal"
    >
      <div
        className={cn(
          "relative grid grid-cols-[180px_2fr_180px] items-start justify-between gap-6 rounded-md border bg-card px-6 py-5 transition-all hover:-translate-y-0.5 hover:shadow-md",
          isSelected ? "border-primary" : "border-border"
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted-gray text-white">
            <Package className="h-5 w-5 font-light" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-heading text-[13px] text-foreground">
              {order.orderNumber}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {formatDate(order.docDate)} &middot; {order.totalQuantity} Items
            </p>

          </div>
        </div>

        <div className="min-w-0">
          <div className="text-sm mb-2">{order.vertical}</div>
          <FulfillmentBar delivered={delivered} pending={pending} cancelled={cancelled} total={total} />
        </div>

        <div className="flex flex-col items-end gap-2">
          <p className="font-mono text-[15px] font-bold text-foreground">
            {formatCurrency(order.docTotal)}
          </p>
          {order.openOrderValue > 0 && (
            <p className="text-[11px] font-heading text-[#B4222E]">
              {formatCurrency(order.openOrderValue)} pending
            </p>
          )}
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadge status={order.orderDeliveryStatus} className="font-light" />
          </div>
          <div className="flex flex-col mt-1 gap-1.5">
            <StatusBadge status={order.orderType} className="font-light uppercase" />
          </div>
        </div>
      </div>
    </button>
  );
};