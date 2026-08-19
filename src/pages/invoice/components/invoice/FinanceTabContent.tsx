import type { Tab } from "@/types/invoice.types";
import { OverviewTab } from "../overview/OverviewTab";
import { InvoicesTab } from "../invoices/InvoicesTab";
import { TransactionsTab } from "../ledger/TransactionsTab";

interface FinanceTabContentProps {
    activeTab: Tab;
    businessPartnerId: string;
    enabled: boolean;
    search: string;
    dateFrom: string;
    dateTo: string;
    selectedVerticals: string[];
    onViewAllInvoices: () => void;
}

export function FinanceTabContent({
    activeTab,
    businessPartnerId,
    enabled,
    search,
    dateFrom,
    dateTo,
    selectedVerticals,
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
                search={search}
                dateFrom={dateFrom}
                dateTo={dateTo}
                selectedVerticals={selectedVerticals}
            />
        );
    }

    if (activeTab === "ledger") {
        return <TransactionsTab businessPartnerId={businessPartnerId} enabled={enabled} />;
    }

    return null;
}