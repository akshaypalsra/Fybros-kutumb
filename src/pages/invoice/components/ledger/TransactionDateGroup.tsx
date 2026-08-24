import type { LedgerEntry } from "@/types/ledger.types";
import { TransactionRow } from "./TransactionRow";
import { Heading } from "@/common/components/Heading";


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
    <Heading
      title={
        <>
          {formatGroupDate(dateKey)}{" "}
          <span className="font-normal text-muted-foreground">
            ({entries.length} Transaction{entries.length !== 1 ? "s" : ""})
          </span>
        </>
      }
      className="mb-2"
    />

    <div className="space-y-3">
      {entries.map((entry, index) => (
        <TransactionRow key={`${entry.docNumber}-${entry.referenceDate}-${index}`} entry={entry} />
      ))}
    </div>
  </div>
);