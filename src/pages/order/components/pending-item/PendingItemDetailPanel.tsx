import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { PendingItem } from "@/types/pending-item.types";
import { formatCurrency } from "@/utils/common.utils";
interface PendingItemDetailPanelProps {
  item: PendingItem | null;
}

export const PendingItemDetailPanel = ({ item }: PendingItemDetailPanelProps) => {

  if (!item) return null;

  return (
    <div className="sticky top-20 rounded-md border border-border bg-card">
      <div className="flex justify-between  border-b border-border">
        <div className="flex flex-col p-5">
          <div className="font-heading text-md text-secondary">Item Details</div>
          <div className="text-xs">{item.itemCode}</div>
        </div>

        <Link
          to={`pending-items/${item.itemCode}`}
          state={{ item }}
          className="flex items-center justify-center gap-1.5 p-4 text-xs font-medium text-foreground transition-colors hover:bg-none"
        >
          View full item
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex flex-col gap-4 border-b border-border p-5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Description</span>
          <span className="mt-0.5 text-sm text-muted-foreground">
            {item.itemDescription.length > 30
              ? `${item.itemDescription.slice(0, 30)}...`
              : item.itemDescription}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Vertical</span>
          <span>{item.vertical}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Pending Quantity</span>
          <span>{item.pendingQuantity} {item.measureUnit}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Order Count</span>
          <span>{item.orderCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Pending Order Value</span>
          <span className="font-mono font-bold">
            {formatCurrency(item.pendingOrderValue)}
          </span>
        </div>
      </div>


    </div>
  );
};