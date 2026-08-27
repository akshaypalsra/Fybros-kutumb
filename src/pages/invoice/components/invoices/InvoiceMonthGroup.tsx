import { Heading } from "@/common/components/Heading";
import { InvoiceRow } from "./InvoiceRow";
import type { Invoice } from "@/types/invoice.types";

interface InvoiceMonthGroupProps {
  month: string;
  invoices: Invoice[];
  selectedInvoiceId?: Invoice["docEntry"];
  onInvoiceClick?: (invoice: Invoice) => void;
}

export const InvoiceMonthGroup = ({
  month,
  invoices,
  selectedInvoiceId,
  onInvoiceClick,
}: InvoiceMonthGroupProps) => (
  <div>
    <Heading
      title={
        <>
          {month}{" "}
          <span className="font-normal text-muted-foreground">
            ({invoices.length} Invoices)
          </span>
        </>
      }
    />
    <div>
      {invoices.map((invoice) => (
        <InvoiceRow
          key={invoice.docEntry}
          invoice={invoice}
          isSelected={selectedInvoiceId === invoice.docEntry}
          onClick={onInvoiceClick}
        />
      ))}
    </div>
  </div>
);