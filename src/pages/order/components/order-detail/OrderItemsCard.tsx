import { Link } from "react-router-dom";
import { Skeleton } from "@/common/components/ui/skeleton";
import { StatusBadge } from "@/common/components/StatusBadge";
import { SegmentedControl } from "@/common/components/SegmentedControl";
import { EmptyState } from "@/common/components/EmptyState";

import type { ItemFilter } from "@/types/order-detail.types";
import type { OrderItem } from "@/types/order.types";
import { formatCurrency } from "@/utils/common.utils";
import { QueryState } from "@/wrapper/QueryState";
import { ErrorState } from "@/common/components/ErrorState";

interface OrderItemsCardProps {
    orderId: string;
    items?: OrderItem[];
    filteredItems: OrderItem[];
    isLoading: boolean;
    isError: boolean;
    itemFilter: ItemFilter;
    onFilterChange: (filter: ItemFilter) => void;
}

const FILTERS: ItemFilter[] = ["ALL", "DELIVERED", "PENDING"];

const OrderItemCard = ({
    orderId,
    item,
}: {
    orderId: string;
    item: OrderItem;
}) => (
    <Link
        to={`/orders/${orderId}/items/${item.id}`}
        className="relative block rounded-md border border-border p-4 transition-colors hover:bg-muted/50"
    >
        <StatusBadge
            status={item.deliveryStatus}
            className="absolute right-4 top-4"
        />

        <div className="flex items-baseline justify-between pr-24">
            <p className="text-sm font-semibold text-foreground">
                {item.itemCode}
            </p>
        </div>

        <p className="mt-0.5 pr-4 text-sm text-foreground">
            {item.itemDescription}
        </p>

        <div className="mt-2 flex items-baseline justify-between">
            <p className="text-xs text-muted-foreground">
                {item.quantity} {item.measureUnit} | {formatCurrency(item.price)} each
            </p>

            <p className="text-sm font-semibold text-foreground">
                {formatCurrency(item.lineTotal)}
            </p>
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
    isError,
    itemFilter,
    onFilterChange,
}: OrderItemsCardProps) => (
    <div className="rounded-md col-span-4 border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
                Items {items ? `(${items.length})` : ""}
            </h2>

            <SegmentedControl
                options={FILTERS}
                value={itemFilter}
                onChange={onFilterChange}
                size="sm"
            />
        </div>

        <QueryState
            isLoading={isLoading}
            isError={isError}
            data={filteredItems}
            loading={
                <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            }
            error={<ErrorState message="Failed to load items" />}
            isEmpty={(items) => items.length === 0}
            empty={<EmptyState message="No items found" />}
        >
            {(items) => (
                <div className="grid gap-3 sm:grid-cols-2">
                    {items.map((item) => (
                        <OrderItemCard
                            key={item.id}
                            orderId={orderId}
                            item={item}
                        />
                    ))}
                </div>
            )}
        </QueryState>
    </div>
);