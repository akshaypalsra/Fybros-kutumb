import { Package } from "lucide-react";
import type { PendingItem } from "@/types/pending-item.types";
import { cn, formatCurrency } from "@/utils/common.utils";

interface PendingItemRowProps {
  item: PendingItem;
  isSelected?: boolean;
  onClick?: (item: PendingItem) => void;
}


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

export const PendingItemRow = ({ item, isSelected, onClick }: PendingItemRowProps) => {
  return (
    <button
      data-invoice-row="true"
      onClick={() => onClick?.(item)}
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
            {item.itemCode}
          </p>
         <p className="mt-0.5 text-[11px] text-muted-foreground">
  {item.itemDescription.length > 20
    ? `${item.itemDescription.slice(0, 20)}...`
    : item.itemDescription}
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

    </button>
  );
};