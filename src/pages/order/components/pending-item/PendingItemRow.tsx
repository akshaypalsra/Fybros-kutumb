import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PendingItem } from "@/types/pending-item.types";
import { Card, CardContent } from "@/common/components/ui/card";

interface PendingItemRowProps {
  item: PendingItem;
}

export const PendingItemRow = ({ item }: PendingItemRowProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer rounded-md border border-border bg-card px-6 py-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
      onClick={() =>
        navigate(`/orders/pending-items/${item.itemCode}`, { state: { item } })
      }
    >
      <CardContent className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">
            {item.itemCode}
          </span>
          <span className="shrink-0 text-sm font-semibold text-foreground">
            {item.pendingQuantity} Pcs
          </span>
        </div>

        <div className="text-sm text-muted-foreground">{item.vertical}</div>
        <div className="text-sm text-muted-foreground">{item.itemDescription}</div>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Orders - {item.orderCount}
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};