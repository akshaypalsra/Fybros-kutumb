import { QueryState } from "@/wrapper/QueryState";
import { ErrorState } from "@/common/components/ErrorState";
import { useOverviewTabData } from "../../hooks/useOverviewTabData";
import { CreditOverviewCard } from "./CreditOverviewCard";
import { OutstandingSummaryCard } from "./OutstandingSummaryCard";
import { AgeingDistributionCard } from "./AgeingDistributionCard";
import { PendingInvoicesCard } from "./PendingInvoicesCard";
import FinanceHealthCard from "./FinanceHealthCard";
import { OverviewTabSkeleton } from "./OverviewTabSkeleton";


interface OverviewTabProps {
  businessPartnerId: string;
  enabled: boolean;
  onViewAllInvoices: () => void;
}

export const OverviewTab = ({ businessPartnerId, enabled, onViewAllInvoices }: OverviewTabProps) => {
  const { creditOverview, outstandingSummary, ageingDistribution, pendingInvoices, isLoading, isError } =
    useOverviewTabData({ businessPartnerId, enabled });

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      loading={<OverviewTabSkeleton/>}
      error={<ErrorState className="mb-4" message="Failed to load your finance overview. Please try again." />}
    >
      <div className="grid gap-3 lg:grid-cols-4">
        <CreditOverviewCard creditOverview={creditOverview} />
        <OutstandingSummaryCard outstandingSummary={outstandingSummary} />
        <FinanceHealthCard
          score={87}
          data={[
            { label: "Jan", value: 62 },
            { label: "Feb", value: 70 },
            { label: "Mar", value: 55 },
            { label: "Apr", value: 91 },
          ]}
        />
        <AgeingDistributionCard ageingDistribution={ageingDistribution} />
        <PendingInvoicesCard invoices={pendingInvoices} onViewAll={onViewAllInvoices} />
      </div>
    </QueryState>
  );
};