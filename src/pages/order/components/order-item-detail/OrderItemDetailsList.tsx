import { DetailField } from "@/common/components/DetailField";
import { formatCurrency } from "@/utils/common.utils";
import type { OrderItemDetail } from "@/types/order.types";

interface OrderItemDetailsListProps {
    item: OrderItemDetail;
}

export function OrderItemDetailsList({ item }: OrderItemDetailsListProps) {
    return (
        <div className="rounded-md border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Details</h2>
            <div className="space-y-0 divide-y divide-border">
                <DetailField label="Item Code" value={item.itemCode} layout="row" isFirst />
                <DetailField label="HSN Code" value={item.hsnCode} layout="row" />
                <DetailField label="Order Number" value={item.orderNumber} layout="row" />
                <DetailField label="Line Number" value={item.lineNumber} layout="row" />
                <DetailField label="Unit Price" value={formatCurrency(item.price)} layout="row" />
                <DetailField label="Order Quantity" value={`${item.quantity} ${item.measureUnit}`} layout="row" />
                <DetailField label="Delivered Quantity" value={`${item.deliveryQuantity} ${item.measureUnit}`} layout="row" />
                <DetailField label="Pending Quantity" value={`${item.pendingQuantity} ${item.measureUnit}`} layout="row" />
                <DetailField label="UOM" value={item.measureUnit} layout="row" isLast />
            </div>
        </div>
    );
}