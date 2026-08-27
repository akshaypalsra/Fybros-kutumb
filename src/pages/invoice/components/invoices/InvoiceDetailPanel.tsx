import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { Invoice } from "@/types/invoice.types";
import { InvoiceInfoCard } from "../invoice-detail/InvoiceInfoCard";
import TaxSummary from "../invoice/TaxSummary";

interface InvoiceDetailPanelProps {
    invoice: Invoice | null;
}

export const InvoiceDetailPanel = ({ invoice }: InvoiceDetailPanelProps) => {
    if (!invoice) return null;
    return (
        <div className="sticky top-20 rounded-md border border-border bg-card mt-7.75 ">
            <div className="flex justify-between">
                <div className=" flex flex-col  border-b border-border  p-5 ">
                    <div className="font-heading text-md text-secondary">Invoice Details</div>
                    <div className="text-xs ">{invoice.invoiceNumber}</div>
                </div>

                <Link
                    to={`/invoices/${invoice.docEntry}`}
                    className=" flex items-center justify-center gap-1.5  p-4 text-xs font-medium text-foreground transition-colors hover:bg-none"
                >
                    View full invoice
                    <ExternalLink className="h-3 w-3" />
                </Link>
            </div>

            <InvoiceInfoCard invoice={invoice} />
            <TaxSummary
                className="pt-0"
                taxableValue={37984}
                gst={6837}
                roundOff={-0.12}
                totalInvoiceValue={44821}
            />

        </div>
    );
};