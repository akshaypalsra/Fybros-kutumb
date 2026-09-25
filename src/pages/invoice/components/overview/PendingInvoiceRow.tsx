import { FileText } from "lucide-react";
import { StatusBadge } from "@/common/components/StatusBadge";
import { cn, formatCurrency, formatDate, formatInvoiceAge } from "@/utils/common.utils";
import type { Invoice } from "@/types/invoice.types";
import { getInvoiceDueLabel } from "@/utils/invoice.utils";
import { DetailField } from "@/common/components/DetailField";

interface PendingInvoiceRowProps {
  invoice: Invoice;
  isSelected?: boolean;
  onClick?: (invoice: Invoice) => void;
}

export const PendingInvoiceRow = ({ invoice, isSelected, onClick }: PendingInvoiceRowProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();

    const rows = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[data-invoice-row="true"]'),
    );
    const currentIndex = rows.indexOf(e.currentTarget);
    if (currentIndex === -1) return;

    const nextIndex = e.key === "ArrowDown" ? currentIndex + 1 : currentIndex - 1;
    rows[nextIndex]?.focus();
  };
  return (
    <button
      data-invoice-row="true"
      onClick={() => onClick?.(invoice)}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex mb-2 items-start w-full cursor-pointer justify-between gap-4 p-4 rounded-md border border-border bg-card px-6 py-5 transition-all hover:-translate-y-0.5 hover:shadow-md",
        "focus:outline-none",
        isSelected
          ? "border-secondary border"
          : "focus-visible:ring-1 focus-visible:ring-primary",
      )}
    >
      
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex flex-col items-start">
            <DetailField valueClassName="text-secondary text-md" label="Invoice Age" value={formatInvoiceAge(invoice.docDate)} />
            <p className="truncate mt-1 text-lg font-heading ">{invoice.invoiceNumber}</p>
            <p className="text-xs text-muted-foreground mt-1">
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
      
    </button>
  )
};