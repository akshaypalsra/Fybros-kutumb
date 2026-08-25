import { FileText, MousePointerClick, ExternalLink } from "lucide-react";
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
        <div className="sticky top-20 rounded-md border border-border bg-card ">
            <div className=" flex items-center gap-1.5 border-b border-border  text-xs text-muted-foreground p-5 ">
                <MousePointerClick className="h-3 w-3 shrink-0" />
                <span>Right-click another invoice to switch details</span>
            </div>

            <div className=" flex items-start justify-between p-5 pb-0">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <FileText className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-sm font-heading text-foreground">{invoice.invoiceNumber}</p>
                        <p className="text-xs text-muted-foreground">Ref #{invoice.docEntry}</p>
                    </div>
                </div>

            </div>

            <InvoiceInfoCard invoice={invoice} />
            <TaxSummary
                className="pt-0"
                taxableValue={37984}
                gst={6837}
                roundOff={-0.12}
                totalInvoiceValue={44821}
            />
            <Link
                to={`/invoices/${invoice.docEntry}`}
                className=" flex items-center justify-center gap-1.5  p-4 text-xs font-medium text-foreground transition-colors hover:bg-none"
            >
                View full invoice
                <ExternalLink className="h-3 w-3" />
            </Link>
        </div>
    );
};