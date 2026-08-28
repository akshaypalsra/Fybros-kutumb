import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Skeleton } from "@/common/components/ui/skeleton";
import { StatusBadge } from "@/common/components/StatusBadge";
import { getDaysToDue } from "@/utils/orders.utils";
import type { Invoice } from "@/types/invoice.types";
import { formatCurrency, formatDate } from "@/utils/common.utils";
import { QueryState } from "@/wrapper/QueryState";
import { EmptyState } from "@/common/components/EmptyState";
import { ErrorState } from "@/common/components/ErrorState";
import { Heading } from "@/common/components/Heading";

interface OrderInvoicesCardProps {
  invoices?: Invoice[];
  isLoading: boolean;
  isError?: boolean;
}

const InvoiceListItem = ({ invoice }: { invoice: Invoice }) => {
  const daysToDue = getDaysToDue(invoice.docDueDate);

  return (
    <Link
      to={`/invoices/${invoice.docEntry}`}
      className="flex items-start justify-between gap-3 rounded-md  p-3 transition-all bg-muted hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-heading text-foreground">{invoice.invoiceNumber}</p>
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
        <p className="text-sm font-heading text-foreground">{formatCurrency(invoice.docTotal)}</p>
        <StatusBadge status={invoice.status} />
        <StatusBadge status={invoice.cardCode} />
      </div>
    </Link>
  );
};

const InvoicesLoadingState = () => (
  <div className="grid gap-3 sm:grid-cols-1">
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
);

export const OrderInvoicesCard = ({ invoices, isLoading, isError = false }: OrderInvoicesCardProps) => {
  const data = invoices ?? [];

  return (
    <div className="rounded-md border col-span-2 border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <Heading title={'Invoices'} className="mb-0" />
        {!isLoading && !isError && data.length > 0 && (
          <span className="text-xs text-muted-foreground">
            ({data.length} Invoice{data.length !== 1 ? "s" : ""})
          </span>
        )}
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        data={data}
        loading={<InvoicesLoadingState />}
        error={
          <ErrorState
            title="Couldn't load invoices"
            message="Something went wrong while fetching invoices for this order. Please try again."
            className="mx-0 max-w-none"
          />
        }
        isEmpty={(items) => items.length === 0}
   empty={<EmptyState
          title="No invoices found"
          message="There are no invoices associated with this order."
        />}
      >
        {(items) => (
          <div className="grid gap-3 sm:grid-cols-1">
            {items.map((invoice) => (
              <InvoiceListItem key={invoice.docEntry} invoice={invoice} />
            ))}
          </div>
        )}
      </QueryState>
    </div>
  );
};