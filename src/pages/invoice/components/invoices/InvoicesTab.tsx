import { Skeleton } from "@/common/components/ui/skeleton";
import { INVOICE_SUB_TABS} from "@/constants/Constants";
import { SegmentedControl } from "@/common/components/SegmentedControl";
import { useInvoicesTabData } from "../../hooks/useInvoicesTabData";
import { QueryState } from "@/wrapper/QueryState";
import { ErrorState } from "@/common/components/ErrorState";
import { EmptyState } from "@/common/components/EmptyState";

import type { Invoice } from "@/types/invoice.types";
import { InvoiceMonthGroup } from "./InvoiceMonthGroup";
import { useOrderValue } from "@/pages/order/hooks/useOrderValue";
import { OrderStatsCards } from "@/pages/order/components/order/OrderStatsCards";
import { useOrderFilterState } from "@/pages/order/hooks/useOrderFilterState";
import { useOrdersData } from "@/pages/order/hooks/useOrdersData";
import { ListFilters } from "../invoice/ListFilters";
import { useVerticals } from "@/hooks/useVerticals";
import { useListFiltersState } from "../../hooks/useListFiltersState";
import { getSearchPlaceholder } from "@/utils/financeTabs.utils";

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
    subTab,
    setSubTab,
    counts,
    invoicesByMonth,
    hasResults,
    isLoading,
    isError,
  } = useInvoicesTabData({ businessPartnerId, enabled, search, dateFrom, dateTo, selectedVerticals });

  const { tab, query, fromDateIso, toDateIso } = useOrderFilterState();
  const { verticals } = useVerticals();
  const filters = useListFiltersState();
  const { partner } = useOrdersData({
    query,
    dateFrom,
    dateTo,
    selectedVerticals,
    tab,
  });

  const { orderValue, isOrderValueLoading } = useOrderValue({
    cardCode: partner?.cardCode,
    dateFrom,
    dateTo,
    fromDateIso,
    toDateIso,
    query,
    selectedVerticals,
    tab,
  });

  return (
    <>
      <OrderStatsCards orderValue={orderValue} isOrderValueLoading={isOrderValueLoading} />

      <ListFilters
        search={filters.search}
        onSearchChange={filters.setSearch}
        searchPlaceholder={getSearchPlaceholder('invoices')}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        onDateFromChange={filters.setDateFrom}
        onDateToChange={filters.setDateTo}
        verticals={verticals}
        selectedVerticals={filters.selectedVerticals}
        onVerticalsChange={filters.setSelectedVerticals}
      />

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
          </div>
        )}
      </QueryState>
    </>
  );
};