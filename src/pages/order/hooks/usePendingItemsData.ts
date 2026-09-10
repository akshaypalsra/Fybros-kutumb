import { useInfinitePendingItems } from "@/pages/order/hooks/useInfinitePendingItems";
import { useActiveBusinessPartner } from "@/hooks/useActiveBusinessPartner";

interface UsePendingItemsDataParams {
  query: string;
  dateFrom: string;
  dateTo: string;
  selectedVerticals: string[];
}

export const usePendingItemsData = ({
  query,
  dateFrom,
  dateTo,
  selectedVerticals,
}: UsePendingItemsDataParams) => {
  const { partner, isPartnerLoading, isPartnerError, enabled } = useActiveBusinessPartner();

  const {
    pendingItems,
    isLoading: isPendingItemsLoading,
    isError: isPendingItemsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePendingItems(
    {
      query: query.trim() || undefined,
      fromDate: dateFrom || undefined,
      toDate: dateTo || undefined,
      verticals: selectedVerticals.length ? selectedVerticals : undefined,
    },
    enabled,
  );

  return {
    partner,
    pendingItems,
    isLoading: isPartnerLoading || isPendingItemsLoading,
    isError: isPartnerError || isPendingItemsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};