import type { Invoice } from "@/types/invoice.types"

export const GstDetailsCard = ({ invoice }: { invoice: Invoice }) => (
  <div className="space-y-3 rounded-xl border border-border bg-card p-5 text-sm">
    {invoice.buyerGstin && (
      <div>
        <p className="text-xs text-muted-foreground">Buyer GSTIN</p>
        <p className="font-medium text-foreground">{invoice.buyerGstin}</p>
      </div>
    )}
    {invoice.irn && (
      <div className="border-t border-border pt-3">
        <p className="text-xs text-muted-foreground">IRN</p>
        <p className="break-all font-medium text-foreground">{invoice.irn}</p>
      </div>
    )}
  </div>
)