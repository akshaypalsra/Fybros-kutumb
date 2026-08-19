import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { StatusBadge } from "@/common/components/StatusBadge";
import { formatCurrency, formatDate } from "@/utils/common.utils";
import { getInvoiceDueLabel } from "@/utils/invoice.utils";
import type { Invoice } from "@/types/invoice.types";

interface InvoiceRowProps {
  invoice: Invoice;
}

export const InvoiceRow = ({ invoice }: InvoiceRowProps) => (
  <Link
    to={`/invoices/${invoice.docEntry}`}
    className="flex items-start justify-between gap-4 py-3.5 hover:bg-muted/40"
  >
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileText className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{invoice.invoiceNumber}</p>
        <p className="text-xs text-muted-foreground">
          {formatDate(invoice.docDate)} &middot; Due {formatDate(invoice.docDueDate)}
        </p>
        <p className="text-xs text-muted-foreground">{getInvoiceDueLabel(invoice)}</p>
        {invoice.vertical && <p className="mt-1 text-xs text-muted-foreground">{invoice.vertical}</p>}
      </div>
    </div>
    <div className="flex shrink-0 flex-col items-end gap-2">
      <p className="text-sm font-semibold text-foreground">{formatCurrency(invoice.docTotal)}</p>
      <StatusBadge status={invoice.status} variant="hero" />
    </div>
  </Link>
);