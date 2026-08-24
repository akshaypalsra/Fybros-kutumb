import { Skeleton } from "@/common/components/ui/skeleton";
import { INVOICE_SUB_TABS } from "@/constants/Constants";
import { SegmentedControl } from "@/common/components/SegmentedControl";
import { useInvoicesTabData } from "../../hooks/useInvoicesTabData";
import { QueryState } from "@/wrapper/QueryState";
import { ErrorState } from "@/common/components/ErrorState";
import { EmptyState } from "@/common/components/EmptyState";
import { useInfiniteScrollTrigger } from "@/hooks/useInfiniteScrollTrigger";

import type { Invoice } from "@/types/invoice.types";
import { InvoiceMonthGroup } from "./InvoiceMonthGroup";
import { useOrderValue } from "@/pages/order/hooks/useOrderValue";
import { OrderStatsCards } from "@/pages/order/components/order/OrderStatsCards";
import { useOrdersData } from "@/pages/order/hooks/useOrdersData";
import { ListFilters } from "../invoice/ListFilters";
import { useVerticals } from "@/hooks/useVerticals";

import { getSearchPlaceholder } from "@/utils/financeTabs.utils";
import { useListFiltersState } from "../../hooks/useListFiltersState";

interface InvoicesTabProps {
  businessPartnerId: string;
  enabled: boolean;
  filters: ReturnType<typeof useListFiltersState>;
}

export const InvoicesTab = ({ businessPartnerId, enabled, filters }: InvoicesTabProps) => {
  const { verticals } = useVerticals();

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

  const { partner } = useOrdersData({
    query: filters.search,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    selectedVerticals: filters.selectedVerticals,
    tab: "ALL",
  });

  const { orderValue, isOrderValueLoading } = useOrderValue({
    cardCode: partner?.cardCode,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    fromDateIso: filters.fromDateIso,
    toDateIso: filters.toDateIso,
    query: filters.search,
    selectedVerticals: filters.selectedVerticals,
    tab: "ALL",
  });

  const sentinelRef = useInfiniteScrollTrigger(
    () => fetchNextPage(),
    !!hasNextPage && !isFetchingNextPage,
  );

  return (
    <>
      <OrderStatsCards orderValue={orderValue} isOrderValueLoading={isOrderValueLoading} />
      
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

      <QueryState<[string, Invoice[]][]>
        isLoading={isLoading}
        isError={isError}
        data={invoicesByMonth}
        loading={
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-md" />
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

            {hasNextPage && <div ref={sentinelRef} style={{ height: 1 }} />}

            {isFetchingNextPage && (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))}
              </div>
            )}
          </div>
        )}
      </QueryState>
    </>
  );
};