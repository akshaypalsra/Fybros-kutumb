import type { Tab } from "@/types/invoice.types";
import { OverviewTab } from "../overview/OverviewTab";
import { InvoicesTab } from "../invoices/InvoicesTab";
import { TransactionsTab } from "../ledger/TransactionsTab";
import { useListFiltersState } from "../../hooks/useListFiltersState";

interface FinanceTabContentProps {
    activeTab: Tab;
    businessPartnerId: string;
    enabled: boolean;
    filters: ReturnType<typeof useListFiltersState>;
    onViewAllInvoices: () => void;
}

export function FinanceTabContent({
    activeTab,
    businessPartnerId,
    enabled,
    filters,
    onViewAllInvoices,
}: FinanceTabContentProps) {
    if (activeTab === "overview") {
        return (
            <OverviewTab
                businessPartnerId={businessPartnerId}
                enabled={enabled}
                onViewAllInvoices={onViewAllInvoices}
            />
        );
    }

    if (activeTab === "invoices") {
        return (
            <InvoicesTab
                businessPartnerId={businessPartnerId}
                enabled={enabled}
                filters={filters}
            />
        );
    }

    if (activeTab === "ledger") {
        return <TransactionsTab businessPartnerId={businessPartnerId} enabled={enabled} />;
    }

    return null;
}