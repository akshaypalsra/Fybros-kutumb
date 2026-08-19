import { Skeleton } from "@/common/components/ui/skeleton";
import { INVOICE_SUB_TABS } from "@/constants/Constants";
import { SegmentedControl } from "@/common/components/SegmentedControl";
import { useInvoicesTabData } from "../../hooks/useInvoicesTabData";
import { QueryState } from "@/wrapper/QueryState";
import { ErrorState } from "@/common/components/ErrorState";
import { EmptyState } from "@/common/components/EmptyState";

import type { Invoice } from "@/types/invoice.types";
import { InvoiceMonthGroup } from "./InvoiceMonthGroup";
import { OutstandingStatsRow } from "./OutstandingStatsRow";

interface InvoicesTabProps {
  businessPartnerId: string;
  enabled: boolean;
  search: string;
  dateFrom: string;
  dateTo: string;
  selectedVerticals: string[];
}

export const InvoicesTab = ({
  businessPartnerId,
  enabled,
  search,
  dateFrom,
  dateTo,
  selectedVerticals,
}: InvoicesTabProps) => {
  const {
    outstandingSummary,
    subTab,
    setSubTab,
    counts,
    invoicesByMonth,
    hasResults,
    isLoading,
    isError,
  } = useInvoicesTabData({ businessPartnerId, enabled, search, dateFrom, dateTo, selectedVerticals });

  return (
    <>
      <OutstandingStatsRow outstandingSummary={outstandingSummary} />

      <div className="mb-4">
        <SegmentedControl
          options={INVOICE_SUB_TABS.map((tab) => tab.key)}
          value={subTab}
          onChange={setSubTab}
          counts={counts}
          getLabel={(key) => INVOICE_SUB_TABS.find((tab) => tab.key === key)?.label ?? key}
        />
      </div>

      <QueryState<[string, Invoice[]][]>
        isLoading={isLoading}
        isError={isError}
        data={invoicesByMonth}
        loading={
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        }
        error={<ErrorState message="Failed to load invoices." />}
        isEmpty={() => !hasResults}
        empty={<EmptyState message="No invoices match your filters." />}
      >
        {(invoicesByMonth) => (
          <div className="space-y-6">
            {invoicesByMonth.map(([month, monthInvoices]) => (
              <InvoiceMonthGroup key={month} month={month} invoices={monthInvoices} />
            ))}
          </div>
        )}
      </QueryState>
    </>
  );
};