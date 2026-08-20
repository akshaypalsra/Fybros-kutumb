import { InvoiceRow } from "./InvoiceRow";
import type { Invoice } from "@/types/invoice.types";

interface InvoiceMonthGroupProps {
  month: string;
  invoices: Invoice[];
}

export const InvoiceMonthGroup = ({ month, invoices }: InvoiceMonthGroupProps) => (
  <div>
    <p className="mb-2 text-sm font-semibold text-foreground">
      {month} <span className="font-normal text-muted-foreground">({invoices.length} Invoices)</span>
    </p>
    <div >
      {invoices.map((invoice) => (
        <InvoiceRow key={invoice.docEntry} invoice={invoice} />
      ))}
    </div>
  </div>
);