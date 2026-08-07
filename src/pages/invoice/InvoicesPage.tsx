import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Badge } from "@/common/components/ui/badge"
import { Skeleton } from "@/common/components/ui/skeleton"

import { useInvoiceApi } from "@/api/invoice/useInvoiceApi"
import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi"

// Local fallback — swap for your project's real `cn` helper (commonly at
// "@/lib/utils") if you have one.
const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ")

interface Invoice {
  cardCode: string
  cardName: string | null
  docDate: string
  docDueDate: string
  docEntry: number
  docTotal: number
  eDocNo: string | null
  eWayBillNumber: string | null
  invoiceNumber: string
  shipToCode: string | null
  status: string
  vertical: string
}

const STATUS_STYLES: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",
  UNPAID: "bg-white/20 text-white border-transparent",
  OVERDUE: "bg-white text-[#E92739] border-transparent",
  "PARTIALLY PAID": "bg-amber-100 text-amber-700 border-amber-200",
}

// status can be missing/null on some records even though the interface
// says `string` — same issue we hit on OrdersPage. Guard against that
// instead of crashing on `.toLowerCase()`.
const StatusBadge = ({
  status,
  className,
}: {
  status: string | null | undefined
  className?: string
}) => (
  <Badge
    variant="outline"
    className={cn(
      "rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
      (status && STATUS_STYLES[status]) ?? "bg-white/20 text-white border-transparent",
      className
    )}
  >
    {status ? status.toLowerCase() : "—"}
  </Badge>
)

const formatCurrency = (value: number | null | undefined) =>
  value != null
    ? value.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
    : "—"

const formatDate = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })
    : "—"

const InvoicesPage = () => {
  const { searchInvoices } = useInvoiceApi()

  const { getBusinessPartners } = useBusinessPartnerApi()

  // getBusinessPartners() returns a single BusinessPartner object for the
  // logged-in user, despite the plural-sounding name — not an array.
  const { data: partner, isLoading: isPartnerLoading } = useQuery({
    queryKey: ["business-partner"],
    queryFn: () => getBusinessPartners(),
  })

  const businessPartnerId = partner?.cardCode ?? ""

  const {
    data: invoices,
    isLoading: isInvoiceLoading,
    isError,
  } = useQuery<Invoice[]>({
    queryKey: ["invoices", businessPartnerId],
    // NOTE: if this endpoint is paginated the same way searchOrders was
    // (returning { content: Invoice[], ... } instead of a bare array),
    // this cast will hide that and you'll hit the same
    // "invoices.map is not a function" crash. Check the real response
    // shape and update searchInvoices in useInvoiceApi.ts to return
    // response.data.content if so — same fix as orderApi.ts.
    queryFn: () => searchInvoices(businessPartnerId) as unknown as Promise<Invoice[]>,
    enabled: !!businessPartnerId,
  })

  const isLoading = isPartnerLoading || isInvoiceLoading
  const invoiceList = invoices ?? []

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Invoices
        </h1>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Failed to load invoices. Please try again.
        </p>
      )}

      {!isLoading && !isError && invoiceList.length === 0 && (
        <p className="text-sm text-muted-foreground">No invoices found.</p>
      )}

      {!isLoading && !isError && invoiceList.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {invoiceList.map((invoice) => (
            <Link
              key={invoice.docEntry}
              to={`/invoices/${invoice.docEntry}`}
              className="block rounded-xl bg-[#E92739] p-5 text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{invoice.invoiceNumber}</p>
                  <p className="text-xs text-white/70">
                    {formatDate(invoice.docDate)} &middot; Due {formatDate(invoice.docDueDate)}
                  </p>
                </div>
                <StatusBadge status={invoice.status} className="shrink-0" />
              </div>

              <p className="mb-4 truncate text-xs text-white/80">
                {invoice.cardName ?? invoice.cardCode}
              </p>

              <p className="text-lg font-bold leading-tight">
                {formatCurrency(invoice.docTotal)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default InvoicesPage