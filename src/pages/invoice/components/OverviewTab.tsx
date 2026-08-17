import { Link } from "react-router-dom"
import { FileText } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Badge } from "@/common/components/ui/badge"
import { Skeleton } from "@/common/components/ui/skeleton"
import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi"
import { useInvoiceApi } from "@/api/invoice/useInvoiceApi"
import type { AgeingBucketResponse, CreditOverview, OutstandingSummary } from "@/types/businessPartner.types"
import type { Invoice } from "@/types/invoice.types"
import { formatCompactCurrency, formatCurrency, formatDate } from "@/utils/invoice.utils"
import { AgeingBar } from "./AgeingBar"
import { StatusBadge } from "./StatusBadge"
import { CreditGauge } from "./CreditGauge"
import { Button } from "@/common/components/ui/button"

export const OverviewTab = ({
  businessPartnerId,
  enabled,
  onViewAllInvoices,
}: {
  businessPartnerId: string
  enabled: boolean
  onViewAllInvoices: () => void
}) => {
  const { getCreditOverview, getOutstandingSummary, getAgeingDistribution } = useBusinessPartnerApi()
  const { searchInvoices } = useInvoiceApi()

  const {
    data: creditOverview,
    isLoading: isCreditLoading,
    isError: isCreditError,
  } = useQuery<CreditOverview>({
    queryKey: ["credit-overview", businessPartnerId],
    queryFn: () => getCreditOverview(),
    enabled,
  })

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
    data: ageingDistribution,
    isLoading: isAgeingLoading,
    isError: isAgeingError,
  } = useQuery<AgeingBucketResponse[]>({
    queryKey: ["ageing-distribution", businessPartnerId],
    queryFn: () => getAgeingDistribution(),
    enabled,
  })

  const {
    data: overviewInvoices,
    isLoading: isInvoiceLoading,
    isError: isInvoiceError,
  } = useQuery<Invoice[]>({
    queryKey: ["invoices", businessPartnerId, "overview"],
    queryFn: () =>
      searchInvoices({
        businessPartnerId,
        invoiceStatus: "PENDING",
        page: 0,
        size: 100,
      }),
    enabled,
  })

  const pendingInvoices = (overviewInvoices ?? []).filter((inv) => inv.status !== "PAID")

  const isLoading = isCreditLoading || isOutstandingLoading || isAgeingLoading || isInvoiceLoading
  const isError = isCreditError || isOutstandingError || isAgeingError || isInvoiceError

  if (isError) {
    return <p className="mb-4 text-sm text-destructive">Failed to load your finance overview. Please try again.</p>
  }

  if (isLoading) {
    return (
      <div className="grid gap-5 lg:grid-cols-3">
        <Skeleton className="h-48 w-full rounded-2xl lg:col-span-2" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl lg:col-span-3" />
        <Skeleton className="h-64 w-full rounded-2xl lg:col-span-3" />
      </div>
    )
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">

      <div className="flex items-center justify-between gap-4 rounded-2xl bg-secondary p-6 text-white shadow-sm lg:col-span-2">
        <div>
          <p className="mb-6 text-sm font-medium text-white/90">Credit overview</p>
          <p className="mb-1 text-3xl font-bold">{formatCompactCurrency(creditOverview?.availableCreditLimit)}</p>
          <p className="text-sm text-white/80">Available credit limit</p>
        </div>
        <CreditGauge pct={creditOverview?.creditUtilizationPercentage ?? 0} />
      </div>

      {/* Outstanding summary */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <p className="mb-4 text-sm font-medium text-muted-foreground">Outstanding summary</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-muted p-3">
            <div>
              <p className="text-xs text-muted-foreground">Outstanding</p>
              <p className="text-[11px] text-muted-foreground">As on today</p>
            </div>
            <p className="text-base font-bold text-foreground">
              {formatCompactCurrency(outstandingSummary?.outstandingAmount)}
            </p>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted p-3">
            <div>
              <p className="text-xs text-muted-foreground">Overdue</p>
              <p className="text-[11px] text-muted-foreground">Past due date</p>
            </div>
            <p className="text-base font-bold text-foreground">
              {formatCompactCurrency(outstandingSummary?.overdueAmount)}
            </p>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted p-3">
            <p className="text-xs text-muted-foreground">Invoices</p>
            <p className="text-base font-bold text-foreground">{outstandingSummary?.totalInvoices ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Ageing distribution */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-3">
        <p className="mb-4 text-sm font-medium text-muted-foreground">Ageing distribution (days)</p>
        <AgeingBar buckets={ageingDistribution ?? []} />
      </div>

      {/* Pending invoices */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Pending invoices ({pendingInvoices.length})</p>
          <Button
            type="button"
            variant="link"
            onClick={onViewAllInvoices}
            className="h-auto p-0 text-sm font-medium text-secondary"
          >
            View all
          </Button>
        </div>

        {pendingInvoices.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending invoices.</p>
        ) : (
          <div className="divide-y">
            {pendingInvoices.map((invoice) => (
              <Link
                key={invoice.docEntry}
                to={`/invoices/${invoice.docEntry}`}
                className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 hover:bg-muted/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{invoice.invoiceNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(invoice.docDate)} &middot; Due {formatDate(invoice.docDueDate)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(invoice.docTotal)}</p>
                  <StatusBadge status={invoice.status} />
                  {invoice.vertical && (
                    <Badge variant="outline" className="rounded-full border-purple-200 bg-purple-100 text-purple-700">
                      {invoice.vertical}
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}