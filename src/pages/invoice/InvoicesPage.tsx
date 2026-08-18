import { useState } from "react";
import type { Tab } from "@/types/invoice.types";
import { FinanceHeader } from "./components/invoice/FinanceHeader";
import { ListFilters } from "./components/invoice/ListFilters";
import { FinanceTabContent } from "./components/invoice/FinanceTabContent";
import { useVerticals } from "@/hooks/useVerticals";
import { useActiveBusinessPartner } from "./hooks/useActiveBusinessPartner";
import { useListFiltersState } from "./hooks/useListFiltersState";

import { ScrollToTopButton } from "@/common/components/ScrollToTopButton";
import { getSearchPlaceholder, shouldShowListFilters } from "@/utils/financeTabs.utils";

const FinanceOverviewPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { partner, businessPartnerId, enabled } = useActiveBusinessPartner();
  const { verticals } = useVerticals();
  const filters = useListFiltersState();

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    filters.reset();
  };

  return (
    <div className="mx-auto max-w-6xl">
      <FinanceHeader
        partnerName={partner?.cardName ?? ""}
        partnerCode={partner?.cardCode ?? ""}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {shouldShowListFilters(activeTab) && (
        <ListFilters
          search={filters.search}
          onSearchChange={filters.setSearch}
          searchPlaceholder={getSearchPlaceholder(activeTab)}
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          onDateFromChange={filters.setDateFrom}
          onDateToChange={filters.setDateTo}
          verticals={verticals}
          selectedVerticals={filters.selectedVerticals}
          onVerticalsChange={filters.setSelectedVerticals}
        />
      )}

      <FinanceTabContent
        activeTab={activeTab}
        businessPartnerId={businessPartnerId}
        enabled={enabled}
        search={filters.search}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        selectedVerticals={filters.selectedVerticals}
        onViewAllInvoices={() => handleTabChange("invoices")}
      />

      <ScrollToTopButton />
    </div>
  );
};

export default FinanceOverviewPage;