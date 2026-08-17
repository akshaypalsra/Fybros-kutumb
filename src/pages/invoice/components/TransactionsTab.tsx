import { useState } from "react"
import { CalendarClock, Receipt } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Skeleton } from "@/common/components/ui/skeleton"
import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi"
import { useTransactionApi, type Transaction } from "@/hooks/useTransaction"
import type { OutstandingSummary } from "@/types/businessPartner.types"
import type { TransactionSubTab } from "@/types/invoice.types"
import { formatCompactCurrency, formatCurrency, formatDate } from "@/utils/invoice.utils"
import { StatCard } from "./StatCard"
import { TRANSACTION_STATUS_STYLES, TRANSACTION_SUB_TABS } from "@/constants/Constants"
import { StatusBadge } from "./StatusBadge"
import { SegmentedControl } from "@/common/components/SegmentedControl"

export const TransactionsTab = ({
  businessPartnerId,
  enabled,
}: {
  businessPartnerId: string
  enabled: boolean
}) => {
  const { getOutstandingSummary } = useBusinessPartnerApi()
  const { searchTransactions } = useTransactionApi()
  const [subTab, setSubTab] = useState<TransactionSubTab>("ALL")

  const {
    data: outstandingSummary,
    isLoading: isOutstandingLoading,
    isError: isOutstandingError,
  } = useQuery<OutstandingSummary>({
    queryKey: ["outstanding-summary", businessPartnerId],
    queryFn: () => getOutstandingSummary(),
    enabled,
  })

  const {
    data: transactions,
    isLoading: isTransactionLoading,
    isError: isTransactionError,
  } = useQuery<Transaction[]>({
    queryKey: ["transactions", businessPartnerId],
    queryFn: () => searchTransactions(businessPartnerId) as unknown as Promise<Transaction[]>,
    enabled,
  })

  const isLoading = isTransactionLoading || isOutstandingLoading
  const isError = isTransactionError || isOutstandingError

  const counts: Partial<Record<TransactionSubTab, number>> = {
    ALL: (transactions ?? []).length,
    CREDIT_NOTE: (transactions ?? []).filter((t) => t.noteType === "CREDIT_NOTE").length,
    DEBIT_NOTE: (transactions ?? []).filter((t) => t.noteType === "DEBIT_NOTE").length,
  }

  const filteredTransactions = (transactions ?? []).filter((txn) => {
    if (subTab === "ALL") return true
    return txn.noteType === subTab
  })

  return (
    <>
      {isError && <p className="mb-4 text-sm text-destructive">Failed to load transactions. Please try again.</p>}

      <div className="mb-5 grid grid-cols-2 gap-4">
        <StatCard
          icon={<Receipt className="h-4 w-4" />}
          label="Total Outstanding"
          value={formatCompactCurrency(outstandingSummary?.outstandingAmount)}
          sublabel="As on Today"
        />
        <StatCard
          icon={<CalendarClock className="h-4 w-4" />}
          label="Overdue"
          value={formatCompactCurrency(outstandingSummary?.overdueAmount)}
          sublabel="Action needed"
        />
      </div>

      <div className="mb-4">
        <SegmentedControl
          options={TRANSACTION_SUB_TABS.map((tab) => tab.key)}
          value={subTab}
          onChange={setSubTab}
          counts={counts}
          getLabel={(key) => TRANSACTION_SUB_TABS.find((tab) => tab.key === key)?.label ?? key}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="rounded-2xl border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">No transactions match your filters.</p>
        </div>
      ) : (
        <div className="divide-y rounded-2xl border bg-card px-5">
          {filteredTransactions.map((txn) => (
            <div key={txn.id} className="flex items-start justify-between gap-4 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{txn.referenceNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(txn.transactionDate)}
                  {txn.orderNumber ? ` | ${txn.orderNumber}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <p className="text-sm font-semibold text-foreground">{formatCurrency(txn.amount)}</p>
                <StatusBadge status={txn.status} styles={TRANSACTION_STATUS_STYLES} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}