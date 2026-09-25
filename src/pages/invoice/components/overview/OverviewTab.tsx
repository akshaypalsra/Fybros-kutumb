import { useEffect, useState } from "react";
import { QueryState } from "@/wrapper/QueryState";
import { ErrorState } from "@/common/components/ErrorState";
import { useOverviewTabData } from "../../hooks/useOverviewTabData";
import { CreditOverviewCard } from "./CreditOverviewCard";
import { OutstandingSummaryCard } from "./OutstandingSummaryCard";
import { AgeingDistributionCard } from "./AgeingDistributionCard";
import { PendingInvoicesCard } from "./PendingInvoicesCard";

// import FinanceHealthCard from "./FinanceHealthCard";
import { OverviewTabSkeleton } from "./OverviewTabSkeleton";
import type { Invoice } from "@/types/invoice.types";
import { InvoiceDetailPanel } from "../invoices/InvoiceDetailPanel";


interface OverviewTabProps {
  businessPartnerId: string;
  enabled: boolean;
  onViewAllInvoices: () => void;
}

export const OverviewTab = ({ businessPartnerId, enabled, onViewAllInvoices }: OverviewTabProps) => {
  const { creditOverview, outstandingSummary, ageingDistribution, pendingInvoices, isLoading, isError } =
    useOverviewTabData({ businessPartnerId, enabled });

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (pendingInvoices.length === 0) {
      setSelectedInvoice(null);
      return;
    }

    const selectionStillValid = pendingInvoices.some(
      (inv) => inv.docEntry === selectedInvoice?.docEntry,
    );

    if (!selectedInvoice || !selectionStillValid) {
      setSelectedInvoice(pendingInvoices[0]);
    }
  }, [pendingInvoices, isLoading]);

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      loading={<OverviewTabSkeleton/>}
      error={<ErrorState className="mb-4" message="Failed to load your finance overview. Please try again." />}
    >
      <div className="grid gap-3 lg:grid-cols-4 mb-6">
         <OutstandingSummaryCard outstandingSummary={outstandingSummary} />
          <CreditOverviewCard creditOverview={creditOverview} />
         <AgeingDistributionCard ageingDistribution={ageingDistribution} />

        {/* <FinanceHealthCard
          score={87}
          data={[
            { label: "Jan", value: 62 },
            { label: "Feb", value: 70 },
            { label: "Mar", value: 55 },
            { label: "Apr", value: 91 },
          ]}
        /> */}
      </div>

      <div className="flex gap-6">
        <div className="w-[60%]">
          <PendingInvoicesCard
            invoices={pendingInvoices}
            onViewAll={onViewAllInvoices}
            selectedInvoiceId={selectedInvoice?.docEntry}
            onInvoiceClick={setSelectedInvoice}
          />
        </div>

        {selectedInvoice && (
          <div className="w-[40%]">
            <InvoiceDetailPanel invoice={selectedInvoice} />
          </div>
        )}
      </div>
    </QueryState>
  );
};