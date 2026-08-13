import { Link } from "react-router-dom"
import { CalendarClock, FileText, Receipt } from "lucide-react"
import { Skeleton } from "@/common/components/ui/skeleton"
import type { OutstandingSummary } from "@/types/businessPartner.types"
import type { Invoice, InvoiceSubTab } from "@/types/invoice.types"
import { formatCompactCurrency, formatCurrency, formatDate, getInvoiceDueLabel } from "@/utils/invoice.utils"
import { StatCard } from "./StatCard"
import { SegmentedTabs } from "./SegmentedTabs"
import { INVOICE_SUB_TABS } from "@/constants/Constants"
import { StatusBadge } from "./StatusBadge"


export const InvoicesTab = ({
  isLoading,
  isError,
  outstandingSummary,
  subTab,
  onSubTabChange,
  counts,
  invoicesByMonth,
  hasResults,
}: {
  isLoading: boolean
  isError: boolean
  outstandingSummary: OutstandingSummary | undefined
  subTab: InvoiceSubTab
  onSubTabChange: (tab: InvoiceSubTab) => void
  counts: Partial<Record<InvoiceSubTab, number>>
  invoicesByMonth: [string, Invoice[]][]
  hasResults: boolean
}) => (
  <>
    {isError && <p className="mb-4 text-sm text-destructive">Failed to load invoices. Please try again.</p>}

    <div className="mb-5 grid grid-cols-2 gap-4">
      <StatCard
        icon={<Receipt className="h-4 w-4" />}
        label="Total Outstanding"
        value={formatCompactCurrency(outstandingSummary?.outstandingAmount)}
        sublabel="As on Today"
      />
      <StatCard
        icon={<CalendarClock className="h-4 w-4" />}
        label="Overdue"
        value={formatCompactCurrency(outstandingSummary?.overdueAmount)}
        sublabel="Action needed"
      />
    </div>

    <div className="mb-4">
      <SegmentedTabs options={INVOICE_SUB_TABS} value={subTab} onChange={onSubTabChange} counts={counts} />
    </div>

    {isLoading ? (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    ) : !hasResults ? (
      <div className="rounded-2xl border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">No invoices match your filters.</p>
      </div>
    ) : (
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
                    <StatusBadge status={invoice.status} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </>
)