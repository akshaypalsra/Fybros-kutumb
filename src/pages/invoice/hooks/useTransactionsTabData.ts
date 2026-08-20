import { useOutstandingSummary } from "@/hooks/useOutstandingSummary";
import { useLedgers } from "./useLedgers";
import { useMemo } from "react";
import { toIsoDateRange } from "@/utils/date.utils";

interface UseTransactionsTabDataParams {
  businessPartnerId: string;
  enabled: boolean;
  fromDate?: string;
  toDate?: string;
}

export function useTransactionsTabData({
  businessPartnerId,
  enabled,
  fromDate,
  toDate,
}: UseTransactionsTabDataParams) {

  const { fromDateIso, toDateIso } = useMemo(() => toIsoDateRange(fromDate, toDate),[fromDate, toDate]);

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
  } = useLedgers({ businessPartnerId, fromDateIso, toDateIso, enabled });

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