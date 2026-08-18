import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useOrderApi } from "@/api/order/useOrderApi";
import type { OrderItem } from "@/types/order.types";
import type { Invoice } from "@/types/invoice.types";
import type { ItemFilter, OrderWithExtras } from "@/types/orderDetail.types";
import { useOrderItemCounts } from "./hooks/useOrderItemCounts";
import { OrderTotalBanner } from "./components/order-detail/OrderTotalBanner";
import { OrderSummaryCard } from "./components/order-detail/OrderSummaryCard";
import { OrderActionButtons } from "./components/order-detail/OrderActionButtons";
import { OrderItemsCard } from "./components/order-detail/OrderItemsCard";
import { OrderInvoicesCard } from "./components/order-detail/OrderInvoicesCard";
import { OrderInfoCard } from "./components/order-detail/OrderInfoCard";
import { OrderHero } from "./components/order-detail/OrderHero";
import { OrderDetailSkeleton } from "./components/order-detail/OrderDetailSkeleton";
import { OrderDetailError } from "./components/order-detail/OrderDetailError";
import { DetailPageHeader } from "@/common/components/DetailPageHeader";
import { QueryStateWrapper } from "@/wrapper/QueryStateWrapper";


const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { orderId = "" } = useParams<{ orderId: string }>();
  const { getOrder, getOrderItems, getOrderInvoices } = useOrderApi();
  const [itemFilter, setItemFilter] = useState<ItemFilter>("ALL");

  const {
    data: order,
    isLoading: isOrderLoading,
    isError: isOrderError,
  } = useQuery<OrderWithExtras>({
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

  return (
    <QueryStateWrapper<OrderWithExtras>
      isLoading={isOrderLoading}
      isError={isOrderError}
      data={order}
      skeleton={<OrderDetailSkeleton />}
      error={<OrderDetailError />}
    >
      {(order) => (
        <div className="mx-auto max-w-6xl pb-24">
          <DetailPageHeader
            title="Order Detail"
            subtitle={order.orderNumber}
            onBack={() => navigate(-1)}
          />
          <OrderHero order={order} status={overallStatus} />

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <OrderInfoCard order={order} />
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
      )}
    </QueryStateWrapper>
  );
};

export default OrderDetailPage;