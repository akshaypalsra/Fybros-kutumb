import { Receipt } from "lucide-react";
import { cn, formatCurrency } from "@/utils/common.utils";
import type { LedgerEntry } from "@/types/ledger.types";


interface TransactionRowProps {
  entry: LedgerEntry;
}

export const TransactionRow = ({ entry }: TransactionRowProps) => {
  const isCredit = entry.credit > 0;
  const amount = isCredit ? entry.credit : entry.debit;

  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-card p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
        <Receipt className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-heading text-foreground">
            {entry.docNumber ? entry.docNumber : "-"}
          </p>
          <p
            className={cn(
              "shrink-0 text-sm font-heading",
              isCredit ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
            )}
          >
            {isCredit ? "+ " : "- "}
            {formatCurrency(Math.abs(amount))}
          </p>
        </div>

        {entry.lineMemo && <p className="mt-1 text-xs text-muted-foreground">{entry.lineMemo}</p>}
      </div>
    </div>
  );
};