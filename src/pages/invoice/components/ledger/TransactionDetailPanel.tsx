import { X } from "lucide-react";
import type { LedgerEntry } from "@/types/ledger.types";

interface TransactionDetailPanelProps {
    entry: LedgerEntry | null;
    onClose: () => void;
}

export const TransactionDetailPanel = ({ entry, onClose }: TransactionDetailPanelProps) => {
    if (!entry) {
        return (
            <div className="flex h-full min-h-75 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                Select a transaction to see details
            </div>
        );
    }

    return (
        <div className="sticky top-4 rounded-md border p-4">
            <div className="mb-4 flex items-start justify-between">
                <h3 className="text-sm font-medium">Transaction Details</h3>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                </button>
            </div>

            <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <dt className="text-muted-foreground">Date</dt>
                    <dd>{entry.referenceDate?.slice(0, 10)}</dd>
                </div>
            </dl>
        </div>
    );
};