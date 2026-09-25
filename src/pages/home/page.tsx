import { ErrorState } from "@/common/components/ErrorState";
import { QueryState } from "@/wrapper/QueryState";

import { HomeSkeleton } from "./components/HomeSkeleton";
import { FinanceSection } from "./components/FinanceSection";
import { SalesSnapshotSection } from "./components/SalesSnapshotSection";
import { useHomeData } from "./hooks/useHomeData";
import { InvoiceSummarySection } from "./components/InvoiceSummarySection";
import { useVerticals } from "@/hooks/useVerticals";
import { Heading } from "@/common/components/Heading";
import { VerticalFilter } from "@/common/components/VerticalFilter";
import { useDashboardFiltersState } from "./hooks/useDashboardFiltersState";

const HomePage = () => {
  const { salesRange, setSalesRange, selectedVerticals, setSelectedVerticals } = useDashboardFiltersState();

  const { verticals } = useVerticals();

  const {
    dashboardStats,
    invoiceSummary,
    salesTrend,
    isLoading,
    isError,
  } = useHomeData({
    salesRange,
    verticals: selectedVerticals,
  });

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      loading={<HomeSkeleton />}
      error={
        <ErrorState
          className="mx-auto  max-w-6xl"
          message="Couldn't load your dashboard. Please try again."
        />
      }
    >
      <main className="mx-auto max-w-6xl gap-4 flex flex-col">
        <div className="flex justify-between items-center">  <Heading title="Sales" className="mb-2 text-lg" />
          <VerticalFilter
            verticals={verticals}
            selected={selectedVerticals}
            onChange={setSelectedVerticals}
          />
        </div>
        <InvoiceSummarySection
          monthTotal={invoiceSummary?.monthTotal}
          quarterTotal={invoiceSummary?.quarterTotal}
          yearTotal={invoiceSummary?.yearTotal}
        />
        <SalesSnapshotSection
          trend={salesTrend}
          range={salesRange}
          onRangeChange={setSalesRange}
        />

        <FinanceSection
          outstandingInvoiceAmount={dashboardStats?.outstandingInvoiceAmount}
          overdueInvoiceAmount={dashboardStats?.overdueInvoiceAmount}
          pendingOrderAmount={dashboardStats?.pendingOrderAmount}
        />



      </main>
    </QueryState>
  );
};

export default HomePage;