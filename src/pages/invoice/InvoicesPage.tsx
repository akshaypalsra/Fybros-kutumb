import type { Tab } from "@/types/invoice.types";
import { FinanceHeader } from "./components/invoice/FinanceHeader";
import { FinanceTabContent } from "./components/invoice/FinanceTabContent";
import { useActiveBusinessPartner } from "../../hooks/useActiveBusinessPartner";
import { ScrollToTopButton } from "@/common/components/ScrollToTopButton";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { TABS } from "@/constants/Constants";
import { useListFiltersState } from "./hooks/useListFiltersState";

const FinanceOverviewPage = () => {
  const { partner, businessPartnerId, enabled } = useActiveBusinessPartner();
  const filters = useListFiltersState();
  const [activeTab, setActiveTab] = useLocalStorageState<Tab>("invoices.activeTab", TABS[0].key);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    filters.clearAll();
  };

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
        filters={filters}
        businessPartnerId={businessPartnerId}
        enabled={enabled}
        onViewAllInvoices={() => handleTabChange("invoices")}
      />

      <ScrollToTopButton />
    </div>
  );
};

export default FinanceOverviewPage;