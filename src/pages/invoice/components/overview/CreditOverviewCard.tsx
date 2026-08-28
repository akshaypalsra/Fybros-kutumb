import { formatCompactCurrency } from "@/utils/common.utils";
import type { CreditOverview } from "@/types/business-partner.types";
import { CreditGauge } from "../invoice/CreditGauge";
import { Heading } from "@/common/components/Heading";

interface CreditOverviewCardProps {
  creditOverview?: CreditOverview;
}

export const CreditOverviewCard = ({ creditOverview }: CreditOverviewCardProps) => (
  <div className="flex items-center justify-between gap-4 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-6 py-3 text-black dark:text-white shadow-sm lg:col-span-2">
    <div>
      <Heading title='Credit Overview'/>
      <p className="mb-1 text-3xl font-bold">{formatCompactCurrency(creditOverview?.availableCreditLimit)}</p>
      <p className="text-sm text-black/60 dark:text-white/60">Available credit limit</p>
    </div>
    <CreditGauge pct={creditOverview?.creditUtilizationPercentage ?? 0} />
  </div>
);