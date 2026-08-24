import { Heading } from "@/common/components/Heading";
import { InvoiceRow } from "./InvoiceRow";
import type { Invoice } from "@/types/invoice.types";

interface InvoiceMonthGroupProps {
  month: string;
  invoices: Invoice[];
}

export const InvoiceMonthGroup = ({ month, invoices }: InvoiceMonthGroupProps) => (
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
    <div >
      {invoices.map((invoice) => (
        <InvoiceRow key={invoice.docEntry} invoice={invoice} />
      ))}
    </div>
  </div>
);