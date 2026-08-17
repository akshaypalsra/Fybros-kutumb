import { useMemo } from "react";
import type { ItemFilter } from "@/types/orderDetail.types";
import type { OrderItem } from "@/types/order.types";

export const useOrderItemCounts = (items: OrderItem[] | undefined, itemFilter: ItemFilter) => {
    const counts = useMemo(() => {
        const delivered = items?.filter((i) => i.deliveryStatus === "DELIVERED").length ?? 0;
        const pending =
            items?.filter((i) => i.deliveryStatus !== "DELIVERED" && i.deliveryStatus !== "CANCELLED").length ?? 0;
        const cancelled = items?.filter((i) => i.deliveryStatus === "CANCELLED").length ?? 0;
        const total = Math.max(delivered + pending + cancelled, 1);
        return {
            delivered,
            pending,
            cancelled,
            deliveredPct: Math.round((delivered / total) * 100),
            pendingPct: Math.round((pending / total) * 100),
            cancelledPct: Math.round((cancelled / total) * 100),
        };
    }, [items]);

    const filteredItems = useMemo(() => {
        if (!items) return [];
        if (itemFilter === "ALL") return items;
        if (itemFilter === "DELIVERED") return items.filter((i) => i.deliveryStatus === "DELIVERED");
        return items.filter((i) => i.deliveryStatus !== "DELIVERED" && i.deliveryStatus !== "CANCELLED");
    }, [items, itemFilter]);

    const overallStatus =
        counts.cancelled + counts.pending === 0
            ? "DELIVERED"
            : counts.delivered === 0
                ? "PENDING"
                : "PARTIAL DELIVERY";

    return { counts, filteredItems, overallStatus };
};