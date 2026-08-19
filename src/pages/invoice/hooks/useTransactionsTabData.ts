import { useQuery } from "@tanstack/react-query";
import { useLedgerApi } from "@/api/transaction/useTransactionApi";
import type { LedgerEntry } from "@/api/transaction/transactionApi";
import { useOutstandingSummary } from "@/hooks/useOutstandingSummary";


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
  const { getBusinessPartnerLedgers } = useLedgerApi();

  const {
    data: outstandingSummary,
    isLoading: isOutstandingLoading,
    isError: isOutstandingError,
  } = useOutstandingSummary(businessPartnerId, enabled);

  const {
    data: ledgerEntries,
    isLoading: isTransactionLoading,
    isError: isTransactionError,
  } = useQuery<LedgerEntry[]>({
    queryKey: ["transactions", businessPartnerId, fromDate, toDate],
    queryFn: () => getBusinessPartnerLedgers({ businessPartnerId, fromDate, toDate }),
    enabled,
  });

  return {
    outstandingSummary,
    transactions: ledgerEntries ?? [],
    isLoading: isTransactionLoading || isOutstandingLoading,
    isError: isTransactionError || isOutstandingError,
  };
}