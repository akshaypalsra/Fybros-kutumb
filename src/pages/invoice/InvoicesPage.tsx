import type { Tab } from "@/types/invoice.types";
import { FinanceHeader } from "./components/invoice/FinanceHeader";
import { FinanceTabContent } from "./components/invoice/FinanceTabContent";
import { useActiveBusinessPartner } from "../../hooks/useActiveBusinessPartner";
import { useListFiltersState } from "./hooks/useListFiltersState";
import { ScrollToTopButton } from "@/common/components/ScrollToTopButton";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { TABS } from "@/constants/Constants";

const FinanceOverviewPage = () => {
  const { partner, businessPartnerId, enabled } = useActiveBusinessPartner();
  const filters = useListFiltersState();

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    filters.reset();
  };


  const [activeTab, setActiveTab] = useLocalStorageState<Tab>("invoices.activeTab", TABS[0].key);

  return (
    <div className="mx-auto max-w-6xl">
      <FinanceHeader
        partnerName={partner?.cardName ?? ""}
        partnerCode={partner?.cardCode ?? ""}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

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