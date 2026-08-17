
import type { Invoice } from "@/types/invoice.types"
import { formatSignedCurrency } from "@/utils/invoice.utils"
import { formatCurrency } from "@/utils/orders.utils"

export const TaxSummaryCard = ({ invoice }: { invoice: Invoice }) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <h2 className="mb-3 text-sm font-semibold text-foreground">Tax Summary</h2>
    <div className="space-y-2 rounded-lg bg-muted/40 p-4 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Taxable value</span>
        <span className="font-medium text-foreground">{formatCurrency(invoice.taxableValue)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">
          IGST{invoice.igstRate != null ? ` @ ${invoice.igstRate}%` : ""}
        </span>
        <span className="font-medium text-foreground">{formatCurrency(invoice.igstAmount)}</span>
      </div>
      {invoice.roundOff != null && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Round off</span>
          <span className="font-medium text-foreground">{formatSignedCurrency(invoice.roundOff)}</span>
        </div>
      )}
      <div className="flex justify-between border-t border-border pt-2">
        <span className="font-semibold text-foreground">Total invoice value</span>
        <span className="font-semibold text-secondary">{formatCurrency(invoice.docTotal)}</span>
      </div>
    </div>
  </div>
)