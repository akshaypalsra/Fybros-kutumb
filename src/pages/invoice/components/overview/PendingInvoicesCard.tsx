import { ChevronRight } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { EmptyState } from "@/common/components/EmptyState";
import type { Invoice } from "@/types/invoice.types";
import { InvoiceRow } from "../invoices/InvoiceRow";
import { Heading } from "@/common/components/Heading";
import { PendingInvoiceRow } from "./PendingInvoiceRow";

interface PendingInvoicesCardProps {
  invoices: Invoice[];
  onViewAll: () => void;
}

export const PendingInvoicesCard = ({ invoices, onViewAll }: PendingInvoicesCardProps) => (
  <div className="lg:col-span-4">
    <div className="mb-4 flex items-center justify-between">
      <Heading
        className="mb-0"
        title={
          <>
            Pending invoices{" "}
            <span className="font-normal text-muted-foreground">
              ({invoices.length} Invoices)
            </span>
          </>
        }
      />

      <Button
        type="button"
        variant="link"
        onClick={onViewAll}
        className="h-auto gap-1 p-0 text-sm font-medium text-secondary"
      >
        View all
        <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>

    {invoices.length === 0 ? (
      <EmptyState message="No pending invoices." />
    ) : (
      <div className="divide-y">
        {invoices.map((invoice) => (
          <PendingInvoiceRow key={invoice.docEntry} invoice={invoice} />
        ))}
      </div>
    )}
  </div>
);