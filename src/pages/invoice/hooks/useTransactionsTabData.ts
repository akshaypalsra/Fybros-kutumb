import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi";
import { useTransactionApi, type Transaction } from "@/hooks/useTransaction";
import type { OutstandingSummary } from "@/types/businessPartner.types";
import type { TransactionSubTab } from "@/types/invoice.types";

interface UseTransactionsTabDataParams {
    businessPartnerId: string;
    enabled: boolean;
}

export function useTransactionsTabData({ businessPartnerId, enabled }: UseTransactionsTabDataParams) {
    const { getOutstandingSummary } = useBusinessPartnerApi();
    const { searchTransactions } = useTransactionApi();
    const [subTab, setSubTab] = useState<TransactionSubTab>("ALL");

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
        data: transactions,
        isLoading: isTransactionLoading,
        isError: isTransactionError,
    } = useQuery<Transaction[]>({
        queryKey: ["transactions", businessPartnerId],
        queryFn: () => searchTransactions(businessPartnerId) as unknown as Promise<Transaction[]>,
        enabled,
    });

    const counts: Partial<Record<TransactionSubTab, number>> = {
        ALL: (transactions ?? []).length,
        CREDIT_NOTE: (transactions ?? []).filter((t) => t.noteType === "CREDIT_NOTE").length,
        DEBIT_NOTE: (transactions ?? []).filter((t) => t.noteType === "DEBIT_NOTE").length,
    };

    const filteredTransactions = (transactions ?? []).filter((txn) => {
        if (subTab === "ALL") return true;
        return txn.noteType === subTab;
    });

    return {
        outstandingSummary,
        subTab,
        setSubTab,
        counts,
        filteredTransactions,
        isLoading: isTransactionLoading || isOutstandingLoading,
        isError: isTransactionError || isOutstandingError,
    };
}