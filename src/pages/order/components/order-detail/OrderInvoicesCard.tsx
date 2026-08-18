// src/orders/components/OrderInvoicesCard.tsx
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Skeleton } from "@/common/components/ui/skeleton";
import { StatusBadge } from "@/common/components/StatusBadge";
import {  getDaysToDue } from "@/utils/orders.utils";
import type { Invoice } from "@/types/invoice.types";
import { formatCurrency, formatDate } from "@/utils/common.utils";

interface OrderInvoicesCardProps {
  invoices?: Invoice[];
  isLoading: boolean;
}

const InvoiceListItem = ({ invoice }: { invoice: Invoice }) => {
  const daysToDue = getDaysToDue(invoice.docDueDate);

  return (
    <Link
      to={`/invoices/${invoice.docEntry}`}
      className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{invoice.invoiceNumber}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(invoice.docDate)} · Due {formatDate(invoice.docDueDate)}
          </p>
          {daysToDue != null && invoice.status !== "CANCELLED" && (
            <p className="text-xs text-muted-foreground">
              {daysToDue >= 0
                ? `${daysToDue} day${daysToDue === 1 ? "" : "s"} to due`
                : `${Math.abs(daysToDue)} day${Math.abs(daysToDue) === 1 ? "" : "s"} overdue`}
            </p>
          )}
          {invoice.vertical && <p className="mt-1 text-xs text-muted-foreground">{invoice.vertical}</p>}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <p className="text-sm font-semibold text-foreground">{formatCurrency(invoice.docTotal)}</p>
        <StatusBadge status={invoice.status} />
      </div>
    </Link>
  );
};

export const OrderInvoicesCard = ({ invoices, isLoading }: OrderInvoicesCardProps) => {
  if (!isLoading && (!invoices || invoices.length === 0)) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Invoices</h2>
        {invoices && <span className="text-xs text-muted-foreground">({invoices.length} Invoices)</span>}
      </div>

      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {!isLoading && invoices && (
        <div className="grid gap-3 sm:grid-cols-2">
          {invoices.map((invoice) => (
            <InvoiceListItem key={invoice.docEntry} invoice={invoice} />
          ))}
        </div>
      )}
    </div>
  );
};