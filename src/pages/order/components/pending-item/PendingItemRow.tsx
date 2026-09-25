import { Package } from "lucide-react";
import type { PendingItem } from "@/types/pending-item.types";
import { cn, formatCurrency } from "@/utils/common.utils";

interface PendingItemRowProps {
  item: PendingItem;
  isSelected?: boolean;
  onClick?: (item: PendingItem) => void;
}

export const PendingItemRow = ({ item, isSelected, onClick }: PendingItemRowProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick?.(item)}
      className="block cursor-pointer w-full appearance-none border-0 bg-transparent p-0 m-0 text-left"
    >
      <div
        className={cn(
          "relative grid grid-cols-[2fr_1fr_1fr] items-center justify-between gap-6 rounded-md border bg-card px-6 py-5 transition-all hover:-translate-y-0.5 hover:shadow-md",
          isSelected ? "border-primary" : "border-border"
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted-gray text-white">
            <Package className="h-5 w-5 font-light" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-heading text-[13px] text-foreground">
              {item.itemCode}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {item.itemDescription}
            </p>
          </div>
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground text-[11px]">Vertical</p>
          <p>{item.vertical}</p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <p className="font-mono text-[15px] font-bold text-foreground">
            {formatCurrency(item.pendingOrderValue)}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {item.pendingQuantity} {item.measureUnit} pending &middot; {item.orderCount} orders
          </p>
        </div>
      </div>
    </button>
  );
};