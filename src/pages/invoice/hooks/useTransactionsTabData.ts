import { useQuery } from "@tanstack/react-query";
import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi";
import type { OutstandingSummary } from "@/types/businessPartner.types";
import { useLedgerApi } from "@/api/transaction/useTransactionApi";
import type { LedgerEntry } from "@/api/transaction/transactionApi";

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
  const { getOutstandingSummary } = useBusinessPartnerApi();
  const { getBusinessPartnerLedgers } = useLedgerApi();

  const {
    data: outstandingSummary,
    isLoading: isOutstandingLoading,
    isError: isOutstandingError,
  } = useQuery<OutstandingSummary>({
    queryKey: ["outstanding-summary", businessPartnerId],
    queryFn: () => getOutstandingSummary(),
    enabled,
  });

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