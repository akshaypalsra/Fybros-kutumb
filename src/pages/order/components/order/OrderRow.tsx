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


  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();

    const rows = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[data-invoice-row="true"]'),
    );
    const currentIndex = rows.indexOf(e.currentTarget);
    if (currentIndex === -1) return;

    const nextIndex = e.key === "ArrowDown" ? currentIndex + 1 : currentIndex - 1;
    rows[nextIndex]?.focus();
  };

  return (


    <button
      data-invoice-row="true"
      onClick={() => onClick?.(order)}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex mb-2 items-start w-full cursor-pointer justify-between gap-4 p-4 rounded-md border border-border bg-card px-6 py-5 transition-all hover:-translate-y-0.5 hover:shadow-md",
        "focus:outline-none",
        isSelected
          ? "border-secondary border"
          : "focus-visible:ring-1 focus-visible:ring-primary",
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

    </button >
  );
};