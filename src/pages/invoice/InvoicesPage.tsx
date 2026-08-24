import type { Tab } from "@/types/invoice.types";
import { FinanceHeader } from "./components/invoice/FinanceHeader";
import { FinanceTabContent } from "./components/invoice/FinanceTabContent";
import { useActiveBusinessPartner } from "../../hooks/useActiveBusinessPartner";
import { ScrollToTopButton } from "@/common/components/ScrollToTopButton";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { TABS } from "@/constants/Constants";
import { useListFiltersState } from "./hooks/useListFiltersState";
import { useLedgerFilterState } from "./hooks/useLedgerFilterState";

const FinanceOverviewPage = () => {
  const { partner, businessPartnerId, enabled } = useActiveBusinessPartner();
  const invoicefilters = useListFiltersState();
  const ledgerfilters = useLedgerFilterState();
  const [activeTab, setActiveTab] = useLocalStorageState<Tab>("invoices.activeTab", TABS[0].key);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    invoicefilters.clearAll();
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
        invoicefilters={invoicefilters}
        ledgerfilters={ledgerfilters}
        businessPartnerId={businessPartnerId}
        enabled={enabled}
        onViewAllInvoices={() => handleTabChange("invoices")}
      />

      <ScrollToTopButton />
    </div>
  );
};

export default FinanceOverviewPage;