import { formatCompactCurrency } from "@/utils/common.utils";
import type { OutstandingSummary } from "@/types/business-partner.types";

interface OutstandingSummaryCardProps {
  outstandingSummary?: OutstandingSummary;
}

const SummaryRow = ({ label, sublabel, value }: { label: string; sublabel?: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between rounded-md bg-muted p-3">
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      {sublabel && <p className="text-[11px] text-muted-foreground">{sublabel}</p>}
    </div>
    <p className="text-base font-bold text-foreground">{value}</p>
  </div>
);

export const OutstandingSummaryCard = ({ outstandingSummary }: OutstandingSummaryCardProps) => (
  <div className="rounded-2xl border bg-card p-6 shadow-sm">
    <p className="mb-4 text-sm font-medium text-muted-foreground">Outstanding summary</p>
    <div className="space-y-3">
      <SummaryRow
        label="Outstanding"
        sublabel="As on today"
        value={formatCompactCurrency(outstandingSummary?.outstandingAmount)}
      />
      <SummaryRow
        label="Overdue"
        sublabel="Past due date"
        value={formatCompactCurrency(outstandingSummary?.overdueAmount)}
      />
      <SummaryRow label="Invoices" value={outstandingSummary?.totalInvoices ?? 0} />
    </div>
  </div>
);