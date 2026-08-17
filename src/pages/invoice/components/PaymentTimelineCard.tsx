import { ReceiptText } from "lucide-react"
import type { InvoicePayment } from "@/types/invoice.types"
import { formatDate } from "@/utils/orders.utils"
import { formatCurrency } from "@/utils/invoice.utils"

export const PaymentTimelineCard = ({ payments }: { payments: InvoicePayment[] }) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <h2 className="mb-3 text-sm font-semibold text-foreground">Payment Timeline</h2>
    <div className="divide-y divide-border">
      {payments.map((payment) => (
        <div key={payment.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ReceiptText className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{payment.id}</p>
            <p className="text-xs text-muted-foreground">{formatDate(payment.date)}</p>
          </div>
          <p className="text-sm font-semibold text-foreground">{formatCurrency(payment.amount)}</p>
        </div>
      ))}
    </div>
  </div>
)