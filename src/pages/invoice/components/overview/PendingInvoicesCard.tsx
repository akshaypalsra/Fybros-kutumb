import { ChevronRight } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { EmptyState } from "@/common/components/EmptyState";
import { PendingInvoiceRow } from "./PendingInvoiceRow";
import type { Invoice } from "@/types/invoice.types";

interface PendingInvoicesCardProps {
  invoices: Invoice[];
  onViewAll: () => void;
}

export const PendingInvoicesCard = ({ invoices, onViewAll }: PendingInvoicesCardProps) => (
  <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-3">
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm font-medium text-muted-foreground">Pending invoices ({invoices.length})</p>
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