import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { Skeleton } from "@/common/components/ui/skeleton";
import { useOrderApi } from "@/api/order/useOrderApi";

import type { OrderItem } from "@/types/order.types";
import type { Invoice } from "@/types/invoice.types";
import type { ItemFilter, OrderWithExtras } from "@/types/orderDetail.types";
import { useOrderItemCounts } from "./hooks/useOrderItemCounts";
import { OrderTotalBanner } from "./components/OrderTotalBanner";
import { OrderSummaryCard } from "./components/OrderSummaryCard";
import { OrderActionButtons } from "./components/OrderActionButtons";
import { OrderItemsCard } from "./components/OrderItemsCard";
import { OrderInvoicesCard } from "./components/OrderInvoicesCard";
import { OrderInfoCard } from "./components/OrderInfoCard";
import { OrderHero } from "./components/OrderHero";
import { OrderDetailHeader } from "./components/OrderDetailHeader";

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { orderId = "" } = useParams<{ orderId: string }>();
  const { getOrder, getOrderItems, getOrderInvoices } = useOrderApi();
  const [itemFilter, setItemFilter] = useState<ItemFilter>("ALL");

  const { data: order, isLoading: isOrderLoading } = useQuery<OrderWithExtras>({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId) as unknown as Promise<OrderWithExtras>,
    enabled: !!orderId,
  });

  const { data: items, isLoading: isItemsLoading } = useQuery<OrderItem[]>({
    queryKey: ["order-items", orderId],
    queryFn: () => getOrderItems(orderId) as unknown as Promise<OrderItem[]>,
    enabled: !!orderId,
  });

  const { data: invoices, isLoading: isInvoicesLoading } = useQuery<Invoice[]>({
    queryKey: ["order-invoices", orderId],
    queryFn: () => getOrderInvoices(orderId) as unknown as Promise<Invoice[]>,
    enabled: !!orderId,
  });

  const computedTotal = order?.docTotal ?? items?.reduce((sum, item) => sum + (item.lineTotal ?? 0), 0);
  const { counts, filteredItems, overallStatus } = useOrderItemCounts(items, itemFilter);

  if (isOrderLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl pb-24">
      <OrderDetailHeader onBack={() => navigate(-1)} />
      <OrderHero order={order} status={overallStatus} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {order && <OrderInfoCard order={order} />}
          <OrderInvoicesCard invoices={invoices} isLoading={isInvoicesLoading} />
          <OrderItemsCard
            orderId={orderId}
            items={items}
            filteredItems={filteredItems}
            isLoading={isItemsLoading}
            itemFilter={itemFilter}
            onFilterChange={setItemFilter}
          />
        </div>

        <div className="space-y-4">
          <OrderTotalBanner order={order} computedTotal={computedTotal} />
          <OrderSummaryCard order={order} items={items ?? []} counts={counts} computedTotal={computedTotal} />
          <OrderActionButtons />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;