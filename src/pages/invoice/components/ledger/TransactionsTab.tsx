import { useMemo, useState } from "react";
import { QueryState } from "@/wrapper/QueryState";
import { Skeleton } from "@/common/components/ui/skeleton";
import { EmptyState } from "@/common/components/EmptyState";
import { ErrorState } from "@/common/components/ErrorState";
import { DateFilter } from "@/common/components/DateFilter";
import { useTransactionsTabData } from "../../hooks/useTransactionsTabData";
import { useInfiniteScrollTrigger } from "@/hooks/useInfiniteScrollTrigger";
import { TransactionDateGroup } from "./TransactionDateGroup";
import type { LedgerEntry } from "@/types/ledger.types";
import { CreditStatsRow } from "../invoices/CreditStatsRow";

interface TransactionsTabProps {
  businessPartnerId: string;
  enabled: boolean;
}

const groupByDate = (entries: LedgerEntry[]) => {
  const groups = new Map<string, LedgerEntry[]>();
  for (const entry of entries) {
    const dateKey = entry.referenceDate.slice(0, 10);
    if (!groups.has(dateKey)) groups.set(dateKey, []);
    groups.get(dateKey)!.push(entry);
  }
  return Array.from(groups.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
};

export const TransactionsTab = ({ businessPartnerId, enabled }: TransactionsTabProps) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const {
    transactions,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTransactionsTabData({
    businessPartnerId,
    enabled,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  });

  const groupedTransactions = useMemo(() => groupByDate(transactions), [transactions]);

  const sentinelRef = useInfiniteScrollTrigger(
    () => fetchNextPage(),
    !!hasNextPage && !isFetchingNextPage,
  );

  return (
    <div className="mx-auto w-full">
      <CreditStatsRow/>
      <div className="mb-4">
        <DateFilter from={fromDate} to={toDate} onFromChange={setFromDate} onToChange={setToDate} />
      </div>
      <QueryState<LedgerEntry[]>
        isLoading={isLoading}
        isError={isError}
        data={transactions}
        loading={
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-md" />
            ))}
          </div>
        }
        error={<ErrorState message="Failed to load transactions. Please try again." />}
        isEmpty={(data) => data.length === 0}
        empty={<EmptyState message="No transactions match your filters." />}
      >
        {() => (
          <div className="space-y-6">
            {groupedTransactions.map(([dateKey, entries]) => (
              <TransactionDateGroup key={dateKey} dateKey={dateKey} entries={entries} />
            ))}
            {hasNextPage && <div ref={sentinelRef} style={{ height: 1 }} />}
            {isFetchingNextPage && (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))}
              </div>
            )}
          </div>
        )}
      </QueryState>
    </div>
  );
};