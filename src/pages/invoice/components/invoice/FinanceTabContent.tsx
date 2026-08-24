import type { Tab } from "@/types/invoice.types";
import { OverviewTab } from "../overview/OverviewTab";
import { InvoicesTab } from "../invoices/InvoicesTab";
import { TransactionsTab } from "../ledger/TransactionsTab";
import { useListFiltersState } from "../../hooks/useListFiltersState";
import type { useLedgerFilterState } from "../../hooks/useLedgerFilterState";

interface FinanceTabContentProps {
    activeTab: Tab;
    businessPartnerId: string;
    enabled: boolean;
    invoicefilters: ReturnType<typeof useListFiltersState>;
    ledgerfilters: ReturnType<typeof useLedgerFilterState>;
    onViewAllInvoices: () => void;
}

export function FinanceTabContent({
    activeTab,
    businessPartnerId,
    enabled,
    invoicefilters,
    ledgerfilters,
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
                filters={invoicefilters}
            />
        );
    }

    if (activeTab === "ledger") {
        return <TransactionsTab filters={ledgerfilters}  businessPartnerId={businessPartnerId} enabled={enabled} />;
    }

    return null;
}