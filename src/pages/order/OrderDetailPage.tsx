import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useOrderApi } from "@/api/order/useOrderApi";
import type { OrderItem } from "@/types/order.types";
import type { Invoice } from "@/types/invoice.types";
import type { ItemFilter, OrderWithExtras } from "@/types/order-detail.types";
import { useOrderItemCounts } from "./hooks/useOrderItemCounts";
import { OrderSummaryCard } from "./components/order-detail/OrderSummaryCard";
import { OrderItemsCard } from "./components/order-detail/OrderItemsCard";
import { OrderInvoicesCard } from "./components/order-detail/OrderInvoicesCard";
import { OrderInfoCard } from "./components/order-detail/OrderInfoCard";
import { OrderHero } from "./components/order-detail/OrderHero";
import { OrderDetailSkeleton } from "./components/order-detail/OrderDetailSkeleton";
import { OrderDetailError } from "./components/order-detail/OrderDetailError";
import { DetailPageHeader } from "@/common/components/DetailPageHeader";
import { QueryState } from "@/wrapper/QueryState";
import { ITEM_FILTERS } from "@/constants/Constants";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { generateOrderPdf } from "@/utils/generate-order-pdf";


const isItemFilter = (v: string): v is ItemFilter =>
  ITEM_FILTERS.includes(v as ItemFilter);


const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { orderId = "" } = useParams<{ orderId: string }>();
  const { getOrder, getOrderItems, getOrderInvoices } = useOrderApi();


  const [itemFilter, setItemFilter] = useLocalStorageState<ItemFilter>(
    `orders.${orderId}.itemFilter`,
    "ALL",
    isItemFilter
  );

  const {
    data: order,
    isLoading: isOrderLoading,
    isError: isOrderError,
  } = useQuery<OrderWithExtras>({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId) as unknown as Promise<OrderWithExtras>,
    enabled: !!orderId,
  });

  const { data: items, isLoading: isItemsLoading, isError: isItemsError } = useQuery<OrderItem[]>({
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
    <QueryState<OrderWithExtras>
      isLoading={isOrderLoading}
      isError={isOrderError}
      data={order}
      loading={<OrderDetailSkeleton />}
      error={<OrderDetailError />}
    >
      {(order) => (
        <div className="mx-auto max-w-6xl pb-24">
          <DetailPageHeader
            title="Order Detail"
            subtitle={order.orderNumber}
            onBack={() => navigate(-1)}
            onDownload={() => generateOrderPdf(order, items ?? [], invoices ?? [], computedTotal)}
          />

          <div className="grid gap-3 lg:grid-cols-4">
            <OrderHero order={order} status={overallStatus} />
            <OrderSummaryCard items={items ?? []} counts={counts} />
            <OrderInfoCard order={order} items={items ?? []} computedTotal={computedTotal} />
            <OrderInvoicesCard invoices={invoices} isLoading={isInvoicesLoading} />
            <OrderItemsCard
              orderId={orderId}
              items={items}
              filteredItems={filteredItems}
              isLoading={isItemsLoading}
              isError={isItemsError}
              itemFilter={itemFilter}
              onFilterChange={setItemFilter}
            />

          </div>

        </div>



      )}
    </QueryState>
  );
};

export default OrderDetailPage;