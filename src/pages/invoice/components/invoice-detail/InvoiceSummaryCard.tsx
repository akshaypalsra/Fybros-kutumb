import { StatusBadge } from "@/common/components/StatusBadge"
import type { Invoice } from "@/types/invoice.types"

import { formatCurrency, formatDate } from "@/utils/common.utils"

export const InvoiceSummaryCard = ({ invoice }: { invoice: Invoice }) => (
  <div className="rounded-md bg-secondary p-5 text-white shadow-sm">
    <div className="mb-3 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-white/90">{invoice.invoiceNumber}</p>
        <p className="text-xs text-white/70">
          {formatDate(invoice.docDate)}
        </p>
      </div>
      <StatusBadge status={invoice.status} variant="hero" />
    </div>
    <p className="text-2xl font-bold">{formatCurrency(invoice.docTotal)}</p>
    <p className="text-xs text-white/70">Inc. Taxes &amp; Expenses</p>
  </div>
)