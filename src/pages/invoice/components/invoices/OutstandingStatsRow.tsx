import { CalendarClock, Receipt } from "lucide-react";
import { StatSummaryCard } from "@/common/components/StatSummaryCard";
import { formatCompactCurrency } from "@/utils/common.utils";
import type { OutstandingSummary } from "@/types/business-partner.types";

interface OutstandingStatsRowProps {
  outstandingSummary?: OutstandingSummary;
}

export const OutstandingStatsRow = ({ outstandingSummary }: OutstandingStatsRowProps) => (
  <div className="mb-5 grid grid-cols-2 gap-4">
    <StatSummaryCard
      icon={<Receipt className="h-4 w-4 font-light" />}
      label="Total Outstanding"
      variant="accent"
      value={formatCompactCurrency(outstandingSummary?.outstandingAmount)}
      sublabel="As on Today"
    />
    <StatSummaryCard
      icon={<CalendarClock className="h-4 w-4 font-light" />}
      label="Overdue"
      value={formatCompactCurrency(outstandingSummary?.overdueAmount)}
      sublabel="Action needed"
    />
  </div>
);