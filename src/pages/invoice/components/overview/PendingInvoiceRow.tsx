import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Badge } from "@/common/components/ui/badge";
import { StatusBadge } from "@/common/components/StatusBadge";
import { formatCurrency, formatDate } from "@/utils/common.utils";
import type { Invoice } from "@/types/invoice.types";

interface PendingInvoiceRowProps {
  invoice: Invoice;
}

export const PendingInvoiceRow = ({ invoice }: PendingInvoiceRowProps) => (
  <Link
    to={`/invoices/${invoice.docEntry}`}
    className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0 hover:bg-muted/40"
  >
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileText className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-heading text-foreground">{invoice.invoiceNumber}</p>
        <p className="text-xs text-muted-foreground">
          {formatDate(invoice.docDate)} &middot; Due {formatDate(invoice.docDueDate)}
        </p>
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-4">
      <p className="text-sm font-heading text-foreground">{formatCurrency(invoice.docTotal)}</p>
      <StatusBadge status={invoice.status} variant="hero" />
      {invoice.vertical && (
        <Badge variant="outline" className="rounded-full border-purple-200 bg-purple-100 text-purple-700">
          {invoice.vertical}
        </Badge>
      )}
    </div>
  </Link>
);