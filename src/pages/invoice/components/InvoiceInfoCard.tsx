// src/invoices/components/InvoiceInfoCard.tsx
import { Link } from "react-router-dom"

import type { Invoice } from "@/types/invoice.types"
import { formatDate } from "@/utils/orders.utils"
import { DetailField } from "./DetailField"

export const InvoiceInfoCard = ({ invoice }: { invoice: Invoice }) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <h2 className="mb-4 text-sm font-semibold text-foreground">Invoice Details</h2>
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
      <DetailField label="Buyer" value={invoice.cardName ?? invoice.cardCode} />
      <DetailField label="Shipped To" value={invoice.shipToCode} />
      <DetailField label="Vertical" value={invoice.vertical} />
      <DetailField label="Invoice Date" value={formatDate(invoice.docDate)} />
      <DetailField label="Due Date" value={formatDate(invoice.docDueDate)} />
      <DetailField label="Card Code" value={invoice.cardCode} />
      <DetailField label="E-Way Bill No." value={invoice.eWayBillNumber ?? "Not generated"} />
      <DetailField label="e-Doc No." value={invoice.eDocNo} />
    </div>

    {invoice.salesOrderNumbers && invoice.salesOrderNumbers.length > 0 && (
      <div className="mt-4 border-t border-border pt-4">
        <p className="mb-2 text-xs text-muted-foreground">Sales Order</p>
        <div className="flex flex-wrap gap-2">
          {invoice.salesOrderNumbers.map((so) => (
            <Link
              key={so}
              to={`/orders/${so}`}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-secondary transition-colors hover:bg-red-100"
            >
              {so}
            </Link>
          ))}
        </div>
      </div>
    )}
  </div>
)