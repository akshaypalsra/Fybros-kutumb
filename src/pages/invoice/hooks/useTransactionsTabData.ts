import { useOutstandingSummary } from "@/hooks/useOutstandingSummary";
import { useLedgers } from "./useLedgers";

interface UseTransactionsTabDataParams {
  businessPartnerId: string;
  enabled: boolean;
  query?: string;
  fromDateIso?: string;
  toDateIso?: string;
  sortDirection?: "ASC" | "DESC";
}

export function useTransactionsTabData({
  businessPartnerId,
  enabled,
  query,
  fromDateIso,
  toDateIso,
  sortDirection,
}: UseTransactionsTabDataParams) {
  const {
    data: outstandingSummary,
    isLoading: isOutstandingLoading,
    isError: isOutstandingError,
  } = useOutstandingSummary(businessPartnerId, enabled);

  const {
    ledgers: transactions,
    isLoading: isLedgersLoading,
    isError: isLedgersError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLedgers({
    businessPartnerId,
    query,
    fromDateIso,
    toDateIso,
    sortDirection,
    enabled,
  });

  return {
    outstandingSummary,
    transactions,
    isLoading: isOutstandingLoading || isLedgersLoading,
    isError: isOutstandingError || isLedgersError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}