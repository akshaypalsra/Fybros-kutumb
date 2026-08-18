import { CalendarClock, Receipt } from "lucide-react";
import { StatCard } from "../invoice/StatCard";
import { TRANSACTION_STATUS_STYLES, TRANSACTION_SUB_TABS } from "@/constants/Constants";
import { SegmentedControl } from "@/common/components/SegmentedControl";
import { formatCompactCurrency, formatCurrency, formatDate } from "@/utils/common.utils";
import { StatusBadge } from "@/common/components/StatusBadge";

import { useTransactionsTabData } from "../../hooks/useTransactionsTabData";
import { Skeleton } from "@/common/components/ui/skeleton";
import { LoadingEmptyContent } from "@/wrapper/LoadingEmptyContent";

interface TransactionsTabProps {
  businessPartnerId: string;
  enabled: boolean;
}

export const TransactionsTab = ({ businessPartnerId, enabled }: TransactionsTabProps) => {
  const {
    outstandingSummary,
    subTab,
    setSubTab,
    counts,
    filteredTransactions,
    isLoading,
    isError,
  } = useTransactionsTabData({ businessPartnerId, enabled });

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

      <LoadingEmptyContent
        isLoading={isLoading}
        isEmpty={filteredTransactions.length === 0}
        loadingState={
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        }
        emptyState={
          <div className="rounded-2xl border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">No transactions match your filters.</p>
          </div>
        }
      >
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
      </LoadingEmptyContent>
    </>
  );
};