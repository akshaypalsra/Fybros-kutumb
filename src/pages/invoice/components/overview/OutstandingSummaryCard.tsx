import { formatCompactCurrency } from "@/utils/common.utils";
import type { OutstandingSummary } from "@/types/business-partner.types";
import { StatSummaryCard } from "@/common/components/StatSummaryCard";
import { Heading } from "@/common/components/Heading";

interface OutstandingSummaryCardProps {
  outstandingSummary?: OutstandingSummary;
}

export const OutstandingSummaryCard = ({ outstandingSummary }: OutstandingSummaryCardProps) => (
  <div className="rounded-md border bg-card p-6 shadow-sm lg:col-span-2">
    <Heading title='Outstanding Summary'/>
    <div className="grid grid-cols-3 gap-3">
      <StatSummaryCard
        variant="accent"
        label="Outstanding"
        sublabel="As on today"
        value={formatCompactCurrency(outstandingSummary?.outstandingAmount)}
      />
      <StatSummaryCard
        variant="accent"
        label="Overdue"
        sublabel="Past due date"
        value={formatCompactCurrency(outstandingSummary?.overdueAmount)}
      />
      <StatSummaryCard
        variant="accent"
        label="Orders"
        value={String(outstandingSummary?.totalInvoices ?? 0)}
      />
    </div>
  </div>
);