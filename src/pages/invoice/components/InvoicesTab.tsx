import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { CalendarClock, FileText, Receipt } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Skeleton } from "@/common/components/ui/skeleton"
import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi"
import { useInvoiceApi } from "@/api/invoice/useInvoiceApi"
import type { OutstandingSummary } from "@/types/businessPartner.types"
import type { Invoice, InvoiceSubTab } from "@/types/invoice.types"
import { formatCompactCurrency, formatCurrency, formatDate, formatMonthYear, getInvoiceDueLabel } from "@/utils/invoice.utils"
import { StatCard } from "./StatCard"

import { INVOICE_SUB_TABS } from "@/constants/Constants"
import { StatusBadge } from "./StatusBadge"
import { SegmentedControl } from "@/common/components/SegmentedControl"

export const InvoicesTab = ({
  businessPartnerId,
  enabled,
  search,
  dateFrom,
  dateTo,
  selectedVerticals,
}: {
  businessPartnerId: string
  enabled: boolean
  search: string
  dateFrom: string
  dateTo: string
  selectedVerticals: string[]
}) => {
  const { getOutstandingSummary } = useBusinessPartnerApi()
  const { searchInvoices } = useInvoiceApi()

  const [subTab, setSubTab] = useState<InvoiceSubTab>("ALL")

  const trimmedSearch = search.trim()
  const fromDateIso = dateFrom ? new Date(`${dateFrom}T00:00:00.000Z`).toISOString() : undefined
  const toDateIso = dateTo ? new Date(`${dateTo}T23:59:59.999Z`).toISOString() : undefined

  const {
    data: outstandingSummary,
    isLoading: isOutstandingLoading,
    isError: isOutstandingError,
  } = useQuery<OutstandingSummary>({
    queryKey: ["outstanding-summary", businessPartnerId],
    queryFn: () => getOutstandingSummary(),
    enabled,
  })

  const {
    data: invoices,
    isLoading: isInvoiceLoading,
    isError: isInvoiceError,
  } = useQuery<Invoice[]>({
    queryKey: ["invoices", businessPartnerId, trimmedSearch, fromDateIso, toDateIso, selectedVerticals],
    queryFn: () =>
      searchInvoices({
        businessPartnerId,
        query: trimmedSearch || undefined,
        fromDate: fromDateIso,
        toDate: toDateIso,
        verticals: selectedVerticals.length ? selectedVerticals : undefined,
        page: 0,
        size: 100,
      }),
    enabled,
  })

  const isLoading = isInvoiceLoading || isOutstandingLoading
  const isError = isInvoiceError || isOutstandingError

  const counts: Partial<Record<InvoiceSubTab, number>> = {
    ALL: (invoices ?? []).length,
    OPEN: (invoices ?? []).filter((i) => i.status !== "PAID").length,
    CLOSED: (invoices ?? []).filter((i) => i.status === "PAID").length,
    OVERDUE: (invoices ?? []).filter((i) => i.status === "OVERDUE").length,
  }

  const filteredInvoices = (invoices ?? []).filter((invoice) => {
    if (subTab === "ALL") return true
    if (subTab === "OPEN") return invoice.status !== "PAID"
    if (subTab === "CLOSED") return invoice.status === "PAID"
    return invoice.status === "OVERDUE"
  })

  const invoicesByMonth = useMemo(() => {
    const groups = new Map<string, Invoice[]>()
    for (const invoice of filteredInvoices) {
      const key = formatMonthYear(invoice.docDate)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(invoice)
    }
    return Array.from(groups.entries())
  }, [filteredInvoices])

  const hasResults = filteredInvoices.length > 0

  return (
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
        <SegmentedControl
          options={INVOICE_SUB_TABS.map((tab) => tab.key)}
          value={subTab}
          onChange={setSubTab}
          counts={counts}
          getLabel={(key) => INVOICE_SUB_TABS.find((tab) => tab.key === key)?.label ?? key}
        />
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
}