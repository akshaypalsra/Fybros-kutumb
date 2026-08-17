import type { InvoiceLineItem } from "@/types/invoice.types";
import { formatCurrency } from "@/utils/orders.utils";


export const InvoiceItemsCard = ({ items }: { items: InvoiceLineItem[] }) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <h2 className="mb-4 text-sm font-semibold text-foreground">Item Details ({items.length})</h2>
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item, idx) => (
        <div key={`${item.itemCode}-${idx}`} className="relative rounded-lg border border-border p-4">
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
            <p className="text-sm font-semibold text-foreground">{formatCurrency(item.lineTotal)}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)