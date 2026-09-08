import { useEffect, useState } from "react";
import { INVOICE_SUB_TABS } from "@/constants/Constants";
import { SegmentedControl } from "@/common/components/SegmentedControl";
import { useInvoicesTabData } from "../../hooks/useInvoicesTabData";
import { QueryState } from "@/wrapper/QueryState";
import { ErrorState } from "@/common/components/ErrorState";
import { EmptyState } from "@/common/components/EmptyState";
import { useInfiniteScrollTrigger } from "@/hooks/useInfiniteScrollTrigger";
import type { Invoice } from "@/types/invoice.types";
import { InvoiceMonthGroup } from "./InvoiceMonthGroup";
import { InvoiceDetailPanel } from "./InvoiceDetailPanel";
import { ListFilters } from "../invoice/ListFilters";
import { useVerticals } from "@/hooks/useVerticals";

import { getSearchPlaceholder } from "@/utils/financeTabs.utils";
import { useListFiltersState } from "../../hooks/useListFiltersState";
import InvoiceRowSkeleton from "./InvoiceRowSkeleton";
import InvoiceDetailPanelSkeleton from "./InvoiceDetailPanelSkeleton";
import { Skeleton } from "@/common/components/ui/skeleton";
import { FinanceSection } from "@/pages/home/components/FinanceSection";
import { useHomeData } from "@/pages/home/hooks/useHomeData";

interface InvoicesTabProps {
  businessPartnerId: string;
  enabled: boolean;
  filters: ReturnType<typeof useListFiltersState>;
}

export const InvoicesTab = ({ businessPartnerId, enabled, filters }: InvoicesTabProps) => {
  const { verticals } = useVerticals();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
const { outstandingSummary } = useHomeData({ salesRange: "QoQ" });

  const {
    counts,
    invoicesByMonth,
    hasResults,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInvoicesTabData({
    businessPartnerId,
    enabled,
    search: filters.search,
    fromDateIso: filters.fromDateIso,
    toDateIso: filters.toDateIso,
    selectedVerticals: filters.selectedVerticals,
    subTab: filters.subTab,
  });



  const sentinelRef = useInfiniteScrollTrigger(
    () => fetchNextPage(),
    !!hasNextPage && !isFetchingNextPage,
  );

const handleInvoiceClick = (invoice: Invoice) => {
  setSelectedInvoice(invoice);
};

  useEffect(() => {
  if (isLoading) return;

  if (!hasResults) {
    setSelectedInvoice(null);
    return;
  }

  const firstInvoice = invoicesByMonth[0]?.[1]?.[0];
  if (!firstInvoice) return;

  const selectionStillValid = invoicesByMonth.some(([, monthInvoices]) =>
    monthInvoices.some((inv) => inv.docEntry === selectedInvoice?.docEntry),
  );

  if (!selectedInvoice || !selectionStillValid) {
    setSelectedInvoice(firstInvoice);
  }
}, [invoicesByMonth, isLoading, hasResults]);

  return (
    <>
      <FinanceSection
                outstandingAmount={
                  outstandingSummary?.outstandingAmount
                }
                overdueAmount={
                  outstandingSummary?.overdueAmount
                }
                invoices={outstandingSummary?.totalInvoiceAmount ?? 0}
              />

      <ListFilters
        search={filters.search}
        onSearchChange={filters.setSearch}
        searchPlaceholder={getSearchPlaceholder("invoices")}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        onDateFromChange={filters.setDateFrom}
        onDateToChange={filters.setDateTo}
        verticals={verticals}
        selectedVerticals={filters.selectedVerticals}
        hasActiveFilters={!!filters.search || !!filters.dateFrom || !!filters.dateTo || filters.selectedVerticals.length > 0 || filters.subTab !== "ALL"}
        onVerticalsChange={filters.setSelectedVerticals}
        onClearAll={filters.clearAll}
        onClearDates={() => filters.clearFields(["dateFrom", "dateTo"])}
      />

      <div className="mb-4">
        <SegmentedControl
          options={INVOICE_SUB_TABS.map((subTabOption) => subTabOption.key)}
          value={filters.subTab}
          onChange={filters.setSubTab}
          counts={counts}
          getLabel={(key) => INVOICE_SUB_TABS.find((t) => t.key === key)?.label ?? key}
        />
      </div>

      <div className="flex gap-6">
        <div className="w-[60%]">
          <QueryState<[string, Invoice[]][]>
            isLoading={isLoading}
            isError={isError}
            data={invoicesByMonth}
            loading={
              <div className="space-y-3">
                <Skeleton className="h-4 w-28 rounded-md border border-border bg-card " />
                {Array.from({ length: 6 }).map((_, i) => (
                  <InvoiceRowSkeleton key={i} />
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
                  <InvoiceMonthGroup
                    key={month}
                    month={month}
                    invoices={monthInvoices}
                    selectedInvoiceId={selectedInvoice?.docEntry}
                    onInvoiceClick={handleInvoiceClick}
                  />
                ))}
                {hasNextPage && <div ref={sentinelRef} style={{ height: 1 }} />}

                {isFetchingNextPage && (
                  <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <InvoiceRowSkeleton key={i} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </QueryState>
        </div>

        {isLoading ? (
          <div className="w-[40%]">
            <InvoiceDetailPanelSkeleton />
          </div>
        ) : (
          selectedInvoice && (
            <div className="w-[40%]">
              <InvoiceDetailPanel invoice={selectedInvoice} />
            </div>
          )
        )}
      </div>
    </>
  );
};