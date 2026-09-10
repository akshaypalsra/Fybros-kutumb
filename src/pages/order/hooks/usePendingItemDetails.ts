import { useQuery } from "@tanstack/react-query";
import { useOrderApi } from "@/api/order/useOrderApi";

export const usePendingItemDetails = (itemCode: string, enabled = true) => {
  const { getPendingItemDetails } = useOrderApi();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pending-item-detail", itemCode],
    queryFn: () => getPendingItemDetails(itemCode),
    enabled: enabled && !!itemCode,
  });

  return {
    orders: data ?? [],
    isLoading,
    isError,
  };
};