import { Skeleton } from "@/common/components/ui/skeleton";
import { QueryState } from "@/wrapper/QueryState";
import { ErrorState } from "@/common/components/ErrorState";
import { useOverviewTabData } from "../../hooks/useOverviewTabData";
import { CreditOverviewCard } from "./CreditOverviewCard";
import { OutstandingSummaryCard } from "./OutstandingSummaryCard";
import { AgeingDistributionCard } from "./AgeingDistributionCard";
import { PendingInvoicesCard } from "./PendingInvoicesCard";


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
      loading={
        <div className="grid gap-5 lg:grid-cols-3">
          <Skeleton className="h-48 w-full rounded-2xl lg:col-span-2" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl lg:col-span-3" />
          <Skeleton className="h-64 w-full rounded-2xl lg:col-span-3" />
        </div>
      }
      error={<ErrorState className="mb-4" message="Failed to load your finance overview. Please try again." />}
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <CreditOverviewCard creditOverview={creditOverview} />
        <OutstandingSummaryCard outstandingSummary={outstandingSummary} />
        <AgeingDistributionCard ageingDistribution={ageingDistribution} />
        <PendingInvoicesCard invoices={pendingInvoices} onViewAll={onViewAllInvoices} />
      </div>
    </QueryState>
  );
};