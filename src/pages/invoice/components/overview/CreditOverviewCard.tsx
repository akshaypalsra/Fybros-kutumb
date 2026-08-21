import { formatCompactCurrency } from "@/utils/common.utils";
import type { CreditOverview } from "@/types/business-partner.types";
import { CreditGauge } from "../invoice/CreditGauge";

interface CreditOverviewCardProps {
  creditOverview?: CreditOverview;
}

export const CreditOverviewCard = ({ creditOverview }: CreditOverviewCardProps) => (
  <div className="flex items-center justify-between gap-4 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 text-black dark:text-white shadow-sm lg:col-span-2">
    <div>
      <p className="mb-6 text-sm font-medium text-black/90 dark:text-white/90">Credit overview</p>
      <p className="mb-1 text-3xl font-bold">{formatCompactCurrency(creditOverview?.availableCreditLimit)}</p>
      <p className="text-sm text-black/60 dark:text-white/60">Available credit limit</p>
    </div>
    <CreditGauge pct={creditOverview?.creditUtilizationPercentage ?? 0} />
  </div>
);