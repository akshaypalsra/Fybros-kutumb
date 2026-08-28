import { DetailField } from "@/common/components/DetailField";
import { formatCurrency } from "@/utils/common.utils";
import type { OrderItemDetail } from "@/types/order.types";
import { Heading } from "@/common/components/Heading";

interface OrderItemDetailsListProps {
  item: OrderItemDetail;
}

export function OrderItemDetailsList({ item }: OrderItemDetailsListProps) {
  return (
    <div className="rounded-md border border-border bg-card p-6 shadow-sm">
      <Heading title="Details" className="mb-4" />
      <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
        <div className="space-y-0 divide-y divide-border">
          <DetailField label="Item Code" value={item.itemCode} layout="row" isFirst />
          <DetailField label="HSN Code" value={item.hsnCode} layout="row" />
          <DetailField label="Order Number" value={item.orderNumber} layout="row" />
          <DetailField label="Line Number" value={item.lineNumber} layout="row" isLast />
        </div>
        <div className="space-y-0 divide-y divide-border">
          <DetailField label="Unit Price" value={formatCurrency(item.price)} layout="row" isFirst />
          <DetailField
            label="Order Quantity"
            value={`${item.quantity} ${item.measureUnit}`}
            layout="row"
          />
          <DetailField
            label="Delivered Quantity"
            value={`${item.deliveryQuantity} ${item.measureUnit}`}
            layout="row"
          />
          <DetailField
            label="Pending Quantity"
            value={`${item.pendingQuantity} ${item.measureUnit}`}
            layout="row"
            isLast
          />
        </div>
      </div>
    </div>
  );
}