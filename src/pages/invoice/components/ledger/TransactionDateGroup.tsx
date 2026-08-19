import { TransactionRow } from "./TransactionRow";
import type { LedgerEntry } from "@/api/transaction/transactionApi";

interface TransactionDateGroupProps {
  dateKey: string;
  entries: LedgerEntry[];
}

const formatGroupDate = (dateKey: string) =>
  new Date(`${dateKey}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    timeZone: "UTC",
  });

export const TransactionDateGroup = ({ dateKey, entries }: TransactionDateGroupProps) => (
  <div>
    <div className="mb-2 flex items-baseline gap-2">
      <h3 className="text-sm font-semibold text-foreground">{formatGroupDate(dateKey)}</h3>
      <span className="text-xs text-muted-foreground">
        ({entries.length} Transaction{entries.length !== 1 ? "s" : ""})
      </span>
    </div>

    <div className="space-y-3">
      {entries.map((entry, index) => (
        <TransactionRow key={`${entry.docNumber}-${entry.referenceDate}-${index}`} entry={entry} />
      ))}
    </div>
  </div>
);