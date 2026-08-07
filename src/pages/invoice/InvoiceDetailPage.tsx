import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/common/components/ui/badge"
import { Skeleton } from "@/common/components/ui/skeleton"
import { Button } from "@/common/components/ui/button"
import { useInvoiceApi } from "@/api/invoice/useInvoiceApi"

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

const StatusBadge = ({ status }: { status: string }) => (
    <Badge
        variant="outline"
        className={cn(
            "rounded-full border px-3 py-0.5 text-xs font-semibold capitalize",
            STATUS_STYLES[status] ?? "bg-white/20 text-white border-transparent"
        )}
    >
        {status.toLowerCase()}
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
            <div className="mx-auto max-w-4xl space-y-4 p-6">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-6xl p-6">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                    Invoice {invoice?.invoiceNumber ?? invoice?.docEntry}
                </h1>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {/* Hero — total + status */}
                <div className="rounded-xl bg-[#E92739] p-5 text-white shadow-sm lg:col-span-1">
                    <div className="mb-3 flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-white/90">
                                {invoice?.invoiceNumber}
                            </p>
                            <p className="text-xs text-white/70">
                                {formatDate(invoice?.docDate)} &middot; Due {formatDate(invoice?.docDueDate)}
                            </p>
                        </div>
                        <StatusBadge status={invoice?.status ?? "—"} />
                    </div>
                    <p className="text-xs text-white/70">Total Invoice Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(invoice?.docTotal)}</p>
                </div>

                {/* Details */}
                <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
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
                            <p className="text-sm font-medium text-foreground">
                                {invoice?.shipToCode ?? "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Vertical</p>
                            <p className="text-sm font-medium text-foreground">{invoice?.vertical ?? "—"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Invoice Date</p>
                            <p className="text-sm font-medium text-foreground">{formatDate(invoice?.docDate)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Due Date</p>
                            <p className="text-sm font-medium text-foreground">{formatDate(invoice?.docDueDate)}</p>
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
                </div>
            </div>
        </div>
    )
}

export default InvoiceDetailPage