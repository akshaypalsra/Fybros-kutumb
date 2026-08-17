// src/orders/components/OrderItemsCard.tsx
import { Link } from "react-router-dom";
import { Skeleton } from "@/common/components/ui/skeleton";
import { StatusBadge } from "@/pages/order/components/StatusBadge";
import {  formatCurrency } from "@/utils/orders.utils";
import type { ItemFilter } from "@/types/orderDetail.types";
import type { OrderItem } from "@/types/order.types";
import { SegmentedControl } from "@/common/components/SegmentedControl";

interface OrderItemsCardProps {
    orderId: string;
    items?: OrderItem[];
    filteredItems: OrderItem[];
    isLoading: boolean;
    itemFilter: ItemFilter;
    onFilterChange: (filter: ItemFilter) => void;
}

const FILTERS: ItemFilter[] = ["ALL", "DELIVERED", "PENDING"];

const OrderItemCard = ({ orderId, item }: { orderId: string; item: OrderItem }) => (
    <Link
        to={`/orders/${orderId}/items/${item.id}`}
        className="relative block rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
    >
        <StatusBadge status={item.deliveryStatus} className="absolute right-4 top-4" />
        <div className="flex items-baseline justify-between pr-24">
            <p className="text-sm font-semibold text-foreground">{item.itemCode}</p>
        </div>
        <p className="mt-0.5 pr-4 text-sm text-foreground">{item.itemDescription}</p>
        <div className="mt-2 flex items-baseline justify-between">
            <p className="text-xs text-muted-foreground">
                {item.quantity} {item.measureUnit} @ {formatCurrency(item.price)} each
            </p>
            <p className="text-sm font-semibold text-foreground">{formatCurrency(item.lineTotal)}</p>
        </div>
        {item.remainingOpenQuantity > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
                {item.remainingOpenQuantity} {item.measureUnit} pending
            </p>
        )}
    </Link>
);

export const OrderItemsCard = ({
    orderId,
    items,
    filteredItems,
    isLoading,
    itemFilter,
    onFilterChange,
}: OrderItemsCardProps) => (
    <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Items {items ? `(${items.length})` : ""}</h2>
            <SegmentedControl options={FILTERS} value={itemFilter} onChange={onFilterChange} />
        </div>

        {isLoading && (
            <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        )}

        {!isLoading && filteredItems.length === 0 && (
            <p className="text-sm text-muted-foreground">No items found.</p>
        )}

        {!isLoading && filteredItems.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
                {filteredItems.map((item) => (
                    <OrderItemCard key={item.id} orderId={orderId} item={item} />
                ))}
            </div>
        )}
    </div>
);