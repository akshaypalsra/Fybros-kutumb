import { useState } from "react";

import { ErrorState } from "@/common/components/ErrorState";
import { QueryState } from "@/wrapper/QueryState";

import { HomeSkeleton } from "./components/HomeSkeleton";
import { HomeHeader } from "./components/HomeHeader";
import { FinanceSection } from "./components/FinanceSection";
import { SalesSnapshotSection } from "./components/SalesSnapshotSection";
import { useHomeData } from "./hooks/useHomeData";
import { OrderSection } from "./components/OrderSection";

const HomePage = () => {
  const [salesRange, setSalesRange] =
    useState<"MoM" | "QoQ">("QoQ");

  const {
    partner,
    outstandingSummary,
    salesTrend,
    isLoading,
    isError,
  } = useHomeData({
    salesRange,
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
      <main className="mx-auto max-w-6xl pb-6">
        <HomeHeader
          cardName={partner?.cardName}
          cardCode={partner?.cardCode}
        />

        <FinanceSection
          outstandingAmount={
            outstandingSummary?.outstandingAmount
          }
          overdueAmount={
            outstandingSummary?.overdueAmount
          }
          invoices={outstandingSummary?.totalInvoiceAmount ?? 0}
        />

        <OrderSection cardCode={partner?.cardCode} />

        <SalesSnapshotSection
          trend={salesTrend}
          range={salesRange}
          onRangeChange={setSalesRange}
        />
      </main>
    </QueryState>
  );
};

export default HomePage;