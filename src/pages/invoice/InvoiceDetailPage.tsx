import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useInvoiceApi } from "@/api/invoice/useInvoiceApi";
import type { Invoice } from "@/types/invoice.types";
import { InvoiceInfoCard } from "./components/invoice-detail/InvoiceInfoCard";
import { InvoiceSummaryCard } from "./components/invoice-detail/InvoiceSummaryCard";
import { InvoiceDetailSkeleton } from "./components/invoice-detail/InvoiceDetailSkeleton";
import { InvoiceDetailError } from "./components/invoice-detail/InvoiceDetailError";
import { DetailPageHeader } from "@/common/components/DetailPageHeader";
import { QueryState } from "@/wrapper/QueryState";
import { InvoiceItemsTable } from "./components/invoice-detail/InvoiceItem";
import PaymentTimeline from "./components/invoice/PaymentTimeline";
import TaxSummary from "./components/invoice/TaxSummary";
import InvoiceTaxDetails from "./components/invoice/InvoiceTaxDetails";


const InvoiceDetailPage = () => {
  const navigate = useNavigate();
  const { invoiceId = "" } = useParams<{ invoiceId: string }>();
  const { getInvoice, downloadInvoicePdf } = useInvoiceApi();
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const {
    data: invoice,
    isLoading,
    isError,
  } = useQuery<Invoice>({
    queryKey: ["invoice", invoiceId],
    queryFn: () => getInvoice(invoiceId),
    enabled: !!invoiceId,
  });

  const handleDownload = async (invoice: Invoice) => {
    setIsPreviewLoading(true);
    try {
      const blob = await downloadInvoicePdf(String(invoice.docEntry));
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  return (
    <QueryState<Invoice>
      isLoading={isLoading}
      isError={isError}
      data={invoice}
      loading={<InvoiceDetailSkeleton />}
      error={<InvoiceDetailError />}
    >
      {(invoice) => (
        <div className="mx-auto max-w-6xl">
          <DetailPageHeader
            title={`Invoice ${invoice.invoiceNumber ?? invoice.docEntry}`}
            onBack={() => navigate(-1)}
            onDownload={() => handleDownload(invoice)}
            isDownloading={isPreviewLoading}
          />


          <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            <div className="space-y-5 lg:col-span-3">
              <InvoiceSummaryCard invoice={invoice} />
            </div>
            <div className="space-y-5 lg:col-span-3">
              <InvoiceInfoCard invoice={invoice} />
              <InvoiceItemsTable invoiceId={invoiceId} />
            </div>

            <div className="space-y-5 lg:col-span-2">
              <TaxSummary
                taxableValue={37984.00}
                gst={6837.00}
                roundOff={-0.12}
                totalInvoiceValue={44821.00}
              />

              <PaymentTimeline
                payments={[
                  {
                    id: "ID-765890",
                    date: "4 May, 2026",
                    amount: 30000.00,
                  },
                  {
                    id: "ID-765891",
                    date: "8 May, 2026",
                    amount: 14821.00,
                  },
                ]}
              />

              <InvoiceTaxDetails
                buyerGSTIN="01AFNPN7720G2ZJ"
                irn="5f1d10fe9d60939a4d4509f433bc1720ef277cb49a8626fcb68956e816125c9f"
              />

            </div>
          </div>
        </div>
      )}
    </QueryState>
  )
}

export default InvoiceDetailPage;