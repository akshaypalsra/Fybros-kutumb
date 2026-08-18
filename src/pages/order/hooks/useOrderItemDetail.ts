import { useQuery } from "@tanstack/react-query";
import { useOrderApi } from "@/api/order/useOrderApi";
import type { OrderItemDetail } from "@/types/order.types";

export function useOrderItemDetail(orderItemId: string) {
  const { getOrderItem } = useOrderApi();

  return useQuery<OrderItemDetail>({
    queryKey: ["order-item", orderItemId],
    queryFn: () => getOrderItem(orderItemId) as unknown as Promise<OrderItemDetail>,
    enabled: !!orderItemId,
  });
}