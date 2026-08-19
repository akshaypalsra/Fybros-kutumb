
import { formatCompactCurrency } from "@/utils/common.utils";
import type { CreditOverview } from "@/types/businessPartner.types";
import { CreditGauge } from "../invoice/CreditGauge";

interface CreditOverviewCardProps {
  creditOverview?: CreditOverview;
}

export const CreditOverviewCard = ({ creditOverview }: CreditOverviewCardProps) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl bg-secondary p-6 text-white shadow-sm lg:col-span-2">
    <div>
      <p className="mb-6 text-sm font-medium text-white/90">Credit overview</p>
      <p className="mb-1 text-3xl font-bold">{formatCompactCurrency(creditOverview?.availableCreditLimit)}</p>
      <p className="text-sm text-white/80">Available credit limit</p>
    </div>
    <CreditGauge pct={creditOverview?.creditUtilizationPercentage ?? 0} />
  </div>
);