import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AlertCircle, ArrowLeft, Download, ReceiptText } from "lucide-react"
import { Badge } from "@/common/components/ui/badge"
import { Skeleton } from "@/common/components/ui/skeleton"
import { Button } from "@/common/components/ui/button"
import { useInvoiceApi } from "@/api/invoice/useInvoiceApi"
import type { Invoice } from "@/types/invoice.types"

const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ")

const STATUS_STYLES: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",
  UNPAID: "bg-white/20 text-white border-transparent",
  OVERDUE: "bg-white text-[#E92739] border-transparent",
  "PARTIALLY PAID": "bg-amber-100 text-amber-700 border-amber-200",
}

const StatusBadge = ({ status }: { status: string }) => (
  <Badge
    variant="outline"
    className={cn(
      "rounded-full border px-3 py-0.5 text-xs font-semibold capitalize",
      STATUS_STYLES[status] ?? "bg-white/20 text-white border-transparent",
    )}
  >
    {status.toLowerCase()}
  </Badge>
)

const formatCurrency = (value: number | null | undefined) =>
  value != null
    ? value.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      })
    : "—"

const formatSignedCurrency = (value: number | null | undefined) => {
  if (value == null) return "—"
  const formatted = formatCurrency(Math.abs(value))
  return value < 0 ? `−${formatted}` : formatted
}

const formatDate = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
    : "—"

const InvoiceDetailPage = () => {
  const navigate = useNavigate()
  const { invoiceId = "" } = useParams<{ invoiceId: string }>()
  const { getInvoice } = useInvoiceApi()

  const { data: invoice, isLoading } = useQuery<Invoice>({
    queryKey: ["invoice", invoiceId],
    queryFn: () => getInvoice(invoiceId) as unknown as Promise<Invoice>,
    enabled: !!invoiceId,
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Invoice {invoice?.invoiceNumber ?? invoice?.docEntry}
          </h1>
        </div>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left column — invoice details, items, tax, remarks */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Invoice Details</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Buyer</p>
                <p className="text-sm font-medium text-foreground">
                  {invoice?.cardName ?? invoice?.cardCode ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Shipped To</p>
                <p className="text-sm font-medium text-foreground">{invoice?.shipToCode ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vertical</p>
                <p className="text-sm font-medium text-foreground">{invoice?.vertical ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Invoice Date</p>
                <p className="text-sm font-medium text-foreground">
                  {formatDate(invoice?.docDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Due Date</p>
                <p className="text-sm font-medium text-foreground">
                  {formatDate(invoice?.docDueDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Card Code</p>
                <p className="text-sm font-medium text-foreground">{invoice?.cardCode ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">E-Way Bill No.</p>
                <p className="text-sm font-medium text-foreground">
                  {invoice?.eWayBillNumber ?? "Not generated"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">e-Doc No.</p>
                <p className="text-sm font-medium text-foreground">{invoice?.eDocNo ?? "—"}</p>
              </div>
            </div>

            {invoice?.salesOrderNumbers && invoice.salesOrderNumbers.length > 0 && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="mb-2 text-xs text-muted-foreground">Sales Order</p>
                <div className="flex flex-wrap gap-2">
                  {invoice.salesOrderNumbers.map((so) => (
                    <Link
                      key={so}
                      to={`/orders/${so}`}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-[#E92739] transition-colors hover:bg-red-100"
                    >
                      {so}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Item Details */}
          {invoice?.items && invoice.items.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-4 text-sm font-semibold text-foreground">
                Item Details ({invoice.items.length})
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {invoice.items.map((item, idx) => (
                  <div
                    key={`${item.itemCode}-${idx}`}
                    className="relative rounded-lg border border-border p-4"
                  >
                    {item.hsnCode && (
                      <span className="absolute right-4 top-4 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        HSN {item.hsnCode}
                      </span>
                    )}
                    <p className="text-sm font-semibold text-foreground">{item.itemCode}</p>
                    <p className="mt-0.5 pr-20 text-sm text-foreground">{item.itemDescription}</p>
                    <div className="mt-2 flex items-baseline justify-between">
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} {item.measureUnit} @ {formatCurrency(item.price)} each
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(item.lineTotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tax Summary */}
          {(invoice?.taxableValue != null || invoice?.igstAmount != null) && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Tax Summary</h2>
              <div className="space-y-2 rounded-lg bg-muted/40 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxable value</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(invoice.taxableValue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    IGST{invoice.igstRate != null ? ` @ ${invoice.igstRate}%` : ""}
                  </span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(invoice.igstAmount)}
                  </span>
                </div>
                {invoice.roundOff != null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Round off</span>
                    <span className="font-medium text-foreground">
                      {formatSignedCurrency(invoice.roundOff)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-semibold text-foreground">Total invoice value</span>
                  <span className="font-semibold text-[#E92739]">
                    {formatCurrency(invoice?.docTotal)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Remarks */}
          {invoice?.remarks && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-[#E92739]">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
              <p>
                <span className="font-medium">Remarks:</span> {invoice.remarks}
              </p>
            </div>
          )}
        </div>

        {/* Right column — hero total, payments, references */}
        <div className="space-y-4">
          <div className="rounded-xl bg-[#E92739] p-5 text-white shadow-sm">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white/90">{invoice?.invoiceNumber}</p>
                <p className="text-xs text-white/70">
                  {formatDate(invoice?.docDate)}
                  {invoice?.settledDate
                    ? ` · Settled on ${formatDate(invoice.settledDate)}`
                    : ` · Due ${formatDate(invoice?.docDueDate)}`}
                </p>
              </div>
              <StatusBadge status={invoice?.status ?? "—"} />
            </div>
            <p className="text-2xl font-bold">{formatCurrency(invoice?.docTotal)}</p>
            <p className="text-xs text-white/70">Inc. Taxes &amp; Expenses</p>
          </div>

          {invoice?.payments && invoice.payments.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Payment Timeline</h2>
              <div className="divide-y divide-border">
                {invoice.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <ReceiptText className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{payment.id}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(payment.date)}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(invoice?.buyerGstin || invoice?.irn) && (
            <div className="space-y-3 rounded-xl border border-border bg-card p-5 text-sm">
              {invoice?.buyerGstin && (
                <div>
                  <p className="text-xs text-muted-foreground">Buyer GSTIN</p>
                  <p className="font-medium text-foreground">{invoice.buyerGstin}</p>
                </div>
              )}
              {invoice?.irn && (
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground">IRN</p>
                  <p className="break-all font-medium text-foreground">{invoice.irn}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InvoiceDetailPage