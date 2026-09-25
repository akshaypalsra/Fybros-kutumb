import { EmptyState } from "@/common/components/EmptyState";
import type { Invoice } from "@/types/invoice.types";
import { Heading } from "@/common/components/Heading";
import { PendingInvoiceRow } from "./PendingInvoiceRow";

interface PendingInvoicesCardProps {
  invoices: Invoice[];
  onViewAll: () => void;
  selectedInvoiceId?: number;
  onInvoiceClick?: (invoice: Invoice) => void;
}

export const PendingInvoicesCard = ({
  invoices,
  selectedInvoiceId,
  onInvoiceClick,
}: PendingInvoicesCardProps) => (
  <div className="lg:col-span-4">
    <div className="mb-4 flex items-center justify-between">
      <Heading
        className="mb-0"
        title={
          <>
            Pending Invoices{" "}
            <span className="font-normal text-muted-foreground">
              ({invoices.length} Invoices)
            </span>
          </>
        }
      />


    </div>

    {invoices.length === 0 ? (
      <EmptyState message="No pending invoices." />
    ) : (
      <div className="divide-y">
        {invoices.map((invoice) => (
          <PendingInvoiceRow
            key={invoice.docEntry}
            invoice={invoice}
            isSelected={invoice.docEntry === selectedInvoiceId}
            onClick={onInvoiceClick}
          />
        ))}
      </div>
    )}
  </div>
);