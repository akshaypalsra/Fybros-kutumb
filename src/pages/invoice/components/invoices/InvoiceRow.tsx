import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { StatusBadge } from "@/common/components/StatusBadge";
import { formatCurrency, formatDate } from "@/utils/common.utils";
import { getInvoiceDueLabel } from "@/utils/invoice.utils";
import { cn } from "@/lib/utils";
import type { Invoice } from "@/types/invoice.types";

interface InvoiceRowProps {
  invoice: Invoice;
  isSelected?: boolean;
  onContextMenu?: (event: React.MouseEvent, invoice: Invoice) => void;
}

export const InvoiceRow = ({ invoice, isSelected, onContextMenu }: InvoiceRowProps) => (
  <Link
    to={`/invoices/${invoice.docEntry}`}
    onContextMenu={(e) => onContextMenu?.(e, invoice)}
    className={cn(
      "flex mb-2 items-start justify-between gap-4 p-4 rounded-md border border-border bg-card px-6 py-5 transition-all hover:-translate-y-0.5 hover:shadow-md",
      isSelected && "border-primary",
    )}
  >
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileText className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-heading text-foreground">{invoice.invoiceNumber}</p>
        <p className="text-xs text-muted-foreground mt-3">
          {formatDate(invoice.docDate)} &middot; Due {formatDate(invoice.docDueDate)}
        </p>
        <p className="text-xs text-muted-foreground">{getInvoiceDueLabel(invoice)}</p>
      </div>
    </div>
    <div className="flex flex-col">
      <div className="flex shrink-0 items-end gap-2">
        <p className="text-sm font-heading text-foreground">{formatCurrency(invoice.docTotal)}</p>
        <StatusBadge status={invoice.status} className="font-light" />
        <StatusBadge status={invoice.cardCode} className="font-light uppercase" />
      </div>

      <div className="mt-4">
        {invoice.vertical && <div className="text-xs text-end text-muted-foreground">{invoice.vertical}</div>}
      </div>
    </div>
  </Link>
);