import { format } from "date-fns";
import type { PendingItemOrderDetail } from "@/types/pending-item.types";
import { Badge } from "@/common/components/ui/badge";

interface PendingItemOrderRowProps {
  order: PendingItemOrderDetail;
}

export const PendingItemOrderRow = ({ order }: PendingItemOrderRowProps) => {
  return (
    <tr className="border-t border-border">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-foreground">{order.orderNumber}</div>
        {order.incoterm && (
          <Badge
            variant="secondary"
            className="mt-1 rounded-full bg-secondary/15 px-2 py-0 text-[11px] font-medium text-secondary"
          >
            {order.incoterm}
          </Badge>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-muted-foreground">
        {format(new Date(order.docDate), "dd/M/yyyy")}
      </td>
      <td className="px-6 py-4 text-sm text-foreground">{order.totalQuantity}</td>
      <td className="px-6 py-4 text-sm text-foreground">{order.pendingPendingQuantity}</td>
    </tr>
  );
};