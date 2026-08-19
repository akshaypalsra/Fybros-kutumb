// InvoicesTab.tsx
import { CalendarClock, FileText, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/common/components/ui/skeleton";
import { StatSummaryCard } from "@/common/components/StatSummaryCard";
import { INVOICE_SUB_TABS } from "@/constants/Constants";
import { SegmentedControl } from "@/common/components/SegmentedControl";
import { formatCompactCurrency, formatCurrency, formatDate } from "@/utils/common.utils";
import { getInvoiceDueLabel } from "@/utils/invoice.utils";
import { StatusBadge } from "@/common/components/StatusBadge";
import { useInvoicesTabData } from "../../hooks/useInvoicesTabData";
import { QueryState } from "@/wrapper/QueryState";
import { ErrorState } from "@/common/components/ErrorState";
import { EmptyState } from "@/common/components/EmptyState";
import type { Invoice } from "@/types/invoice.types";

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
    outstandingSummary,
    subTab,
    setSubTab,
    counts,
    invoicesByMonth,
    hasResults,
    isLoading,
    isError,
  } = useInvoicesTabData({ businessPartnerId, enabled, search, dateFrom, dateTo, selectedVerticals });

  return (
    <>
      <div className="mb-5 grid grid-cols-2 gap-4">
        <StatSummaryCard
          icon={<Receipt className="h-4 w-4" />}
          label="Total Outstanding"
           variant = "accent"
          value={formatCompactCurrency(outstandingSummary?.outstandingAmount)}
          sublabel="As on Today"
        />
        <StatSummaryCard
          icon={<CalendarClock className="h-4 w-4" />}
          label="Overdue"
          value={formatCompactCurrency(outstandingSummary?.overdueAmount)}
          sublabel="Action needed"
        />
      </div>

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
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
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
              <div key={month}>
                <p className="mb-2 text-sm font-semibold text-foreground">
                  {month} <span className="font-normal text-muted-foreground">({monthInvoices.length} Invoices)</span>
                </p>
                <div className="divide-y rounded-2xl border bg-card px-5">
                  {monthInvoices.map((invoice) => (
                    <Link
                      key={invoice.docEntry}
                      to={`/invoices/${invoice.docEntry}`}
                      className="flex items-start justify-between gap-4 py-3.5 hover:bg-muted/40"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">{invoice.invoiceNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(invoice.docDate)} &middot; Due {formatDate(invoice.docDueDate)}
                          </p>
                          <p className="text-xs text-muted-foreground">{getInvoiceDueLabel(invoice)}</p>
                          {invoice.vertical && <p className="mt-1 text-xs text-muted-foreground">{invoice.vertical}</p>}
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <p className="text-sm font-semibold text-foreground">{formatCurrency(invoice.docTotal)}</p>
                        <StatusBadge status={invoice.status} variant="hero" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </QueryState>
    </>
  );
};