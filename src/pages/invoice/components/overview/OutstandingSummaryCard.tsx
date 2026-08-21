import { formatCompactCurrency } from "@/utils/common.utils";
import type { OutstandingSummary } from "@/types/business-partner.types";
import { StatSummaryCard } from "@/common/components/StatSummaryCard";

interface OutstandingSummaryCardProps {
  outstandingSummary?: OutstandingSummary;
}

export const OutstandingSummaryCard = ({ outstandingSummary }: OutstandingSummaryCardProps) => (
  <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2">
    <p className="mb-4 text-sm font-medium text-muted-foreground">Outstanding summary</p>
    <div className="grid grid-cols-3 gap-3">
      <StatSummaryCard
        label="Outstanding"
        sublabel="As on today"
        value={formatCompactCurrency(outstandingSummary?.outstandingAmount)}
      />
      <StatSummaryCard
        label="Overdue"
        sublabel="Past due date"
        value={formatCompactCurrency(outstandingSummary?.overdueAmount)}
      />
      <StatSummaryCard
        label="Invoices"
        value={String(outstandingSummary?.totalInvoices ?? 0)}
      />
    </div>
  </div>
);