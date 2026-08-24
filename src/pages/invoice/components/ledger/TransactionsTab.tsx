import { useMemo } from "react";
import { QueryState } from "@/wrapper/QueryState";
import { Skeleton } from "@/common/components/ui/skeleton";
import { EmptyState } from "@/common/components/EmptyState";
import { ErrorState } from "@/common/components/ErrorState";
import { useTransactionsTabData } from "../../hooks/useTransactionsTabData";
import { useInfiniteScrollTrigger } from "@/hooks/useInfiniteScrollTrigger";
import { TransactionDateGroup } from "./TransactionDateGroup";
import type { LedgerEntry } from "@/types/ledger.types";
import { CreditStatsRow } from "../invoices/CreditStatsRow";
import { TransactionFilters } from "./TransactionFilters";
import type { useLedgerFilterState } from "../../hooks/useLedgerFilterState";

interface TransactionsTabProps {
  businessPartnerId: string;
  enabled: boolean;
  filters: ReturnType<typeof useLedgerFilterState>;  // ← correct type
}

const groupByDate = (entries: LedgerEntry[], sortDirection: "ASC" | "DESC") => {
  const groups = new Map<string, LedgerEntry[]>();
  for (const entry of entries) {
    const dateKey = entry.referenceDate.slice(0, 10);
    if (!groups.has(dateKey)) groups.set(dateKey, []);
    groups.get(dateKey)!.push(entry);
  }
  return Array.from(groups.entries()).sort((a, b) => {
    if (sortDirection === "ASC") return a[0] > b[0] ? 1 : -1;
    return a[0] < b[0] ? 1 : -1;
  });
};

export const TransactionsTab = ({ businessPartnerId, enabled, filters }: TransactionsTabProps) => {
  const {
    query, setQuery,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    fromDateIso, toDateIso,
    sortDirection, setSortDirection,
    clearAll,
  } = filters;

  const { transactions, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTransactionsTabData({
      businessPartnerId,
      enabled,
      query: query || undefined,
      fromDateIso,
      toDateIso,
      sortDirection,
    });

  const groupedTransactions = useMemo(
    () => groupByDate(transactions, sortDirection),
    [transactions, sortDirection],
  );

  const sentinelRef = useInfiniteScrollTrigger(
    () => fetchNextPage(),
    !!hasNextPage && !isFetchingNextPage,
  );

  const hasActiveFilters = !!query || !!dateFrom || !!dateTo;

  return (
    <div className="mx-auto w-full">
      <CreditStatsRow businessPartnerId={businessPartnerId} />
      <TransactionFilters
        query={query}
        onQueryChange={setQuery}
        queryPlaceholder="Search transactions..."
        fromDate={dateFrom}
        toDate={dateTo}
        onFromDateChange={setDateFrom}
        onToDateChange={setDateTo}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        hasActiveFilters={hasActiveFilters}
        onClearAll={clearAll}
      />

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