import { useMemo, useState } from "react";
import { CalendarClock, Receipt } from "lucide-react";
import { StatSummaryCard } from "@/common/components/StatSummaryCard";
import { formatCompactCurrency, formatCurrency } from "@/utils/common.utils";
import { useTransactionsTabData } from "../../hooks/useTransactionsTabData";
import { Skeleton } from "@/common/components/ui/skeleton";
import { QueryState } from "@/wrapper/QueryState";
import { EmptyState } from "@/common/components/EmptyState";
import { ErrorState } from "@/common/components/ErrorState";
import { DateFilter } from "@/common/components/DateFilter";
import { cn } from "@/utils/common.utils";
import type { LedgerEntry } from "@/api/transaction/transactionApi";

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

const formatGroupDate = (dateKey: string) =>
  new Date(`${dateKey}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    timeZone: "UTC",
  });

export const TransactionsTab = ({ businessPartnerId, enabled }: TransactionsTabProps) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { outstandingSummary, transactions, isLoading, isError } = useTransactionsTabData({
    businessPartnerId,
    enabled,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  });

  const groupedTransactions = useMemo(() => groupByDate(transactions), [transactions]);

  return (
    <div className="mx-auto w-full">
      <div className="mb-5 grid grid-cols-2 gap-4">
        <StatSummaryCard
          variant="accent"
          icon={<Receipt className="h-4 w-4" />}
          label="Total Outstanding"
          value={formatCompactCurrency(outstandingSummary?.outstandingAmount)}
          sublabel="As on Today"
        />
        <StatSummaryCard
          icon={<CalendarClock className="h-4 w-4" />}
          label="Overdue"
          value={formatCompactCurrency(outstandingSummary?.overdueAmount)}
          sublabel="Action needed"
        />
      </div>

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
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
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
              <div key={dateKey}>
                <div className="mb-2 flex items-baseline gap-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    {formatGroupDate(dateKey)}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    ({entries.length} Transaction{entries.length !== 1 ? "s" : ""})
                  </span>
                </div>

                <div className="space-y-3">
                  {entries.map((entry, index) => {
                    const isCredit = entry.credit > 0;
                    const amount = isCredit ? entry.credit : entry.debit;

                    return (
                      <div
                        key={`${entry.docNumber}-${entry.referenceDate}-${index}`}
                        className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                          <Receipt className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {entry.docNumber ? entry.docNumber : '-'}
                            </p>
                            <p
                              className={cn(
                                "shrink-0 text-sm font-semibold",
                                isCredit
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-destructive",
                              )}
                            >
                              {isCredit ? "+ " : "- "}
                              {formatCurrency(Math.abs(amount))}
                            </p>
                          </div>

                          {entry.lineMemo && (
                            <p className="mt-1 text-xs text-muted-foreground">{entry.lineMemo}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </QueryState>
    </div>
  );
};