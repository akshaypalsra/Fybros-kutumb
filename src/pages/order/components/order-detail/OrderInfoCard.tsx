import { DetailField } from "@/common/components/DetailField";
import type { OrderWithExtras } from "@/types/order-detail.types";
import type { OrderItem } from "@/types/order.types";
import { formatCurrency, formatDate } from "@/utils/common.utils";
import { Heading } from "@/common/components/Heading";
import { StatusBadge } from "@/common/components/StatusBadge";

interface OrderInfoCardProps {
  order?: OrderWithExtras;
  items: OrderItem[];
  computedTotal: number | undefined;
}

export const OrderInfoCard = ({ order, items, computedTotal }: OrderInfoCardProps) => {
  if (!order?.cardName) return null;

  return (
    <div className="rounded-md border col-span-2 border-border bg-card p-5 max-block-fit">
      <Heading title={'Order Detail'}/>
      <div className="grid grid-cols-3 mt-2 bg-muted rounded-md p-3 space-x-3 space-y-3">
        <DetailField
          label="Order Date"
          value={formatDate(order.docDate)}
        />
        <DetailField
          label="Total Items"
          value={items.length}
        />
        {order.orderType && (
          <DetailField
            label="Order Type"
            value={<StatusBadge status={order.orderType}/>}
          />
        )}
        <DetailField
          label="Order Value"
          value={<span className="font-heading text-secondary">{formatCurrency(computedTotal)}</span>}
        />
        {order.deliveredValue != null && (
          <DetailField
            label="Delivered Order"
            value={formatCurrency(order.deliveredValue)}
          />
        )}
      </div>
    </div>

  );
};