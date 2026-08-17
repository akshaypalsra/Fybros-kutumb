

import type { Invoice } from "@/types/invoice.types"
import { formatCurrency, formatDate } from "@/utils/orders.utils"
import { StatusBadge } from "./StatusBadge"

export const InvoiceSummaryCard = ({ invoice }: { invoice: Invoice }) => (
  <div className="rounded-xl bg-secondary p-5 text-white shadow-sm">
    <div className="mb-3 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-white/90">{invoice.invoiceNumber}</p>
        <p className="text-xs text-white/70">
          {formatDate(invoice.docDate)}
          {invoice.settledDate
            ? ` · Settled on ${formatDate(invoice.settledDate)}`
            : ` · Due ${formatDate(invoice.docDueDate)}`}
        </p>
      </div>
      <StatusBadge status={invoice.status ?? "—"} />
    </div>
    <p className="text-2xl font-bold">{formatCurrency(invoice.docTotal)}</p>
    <p className="text-xs text-white/70">Inc. Taxes &amp; Expenses</p>
  </div>
)