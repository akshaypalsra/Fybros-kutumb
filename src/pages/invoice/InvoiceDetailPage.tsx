// src/invoices/InvoiceDetailPage.tsx
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

const InvoiceDetailPage = () => {
  const navigate = useNavigate();
  const { invoiceId = "" } = useParams<{ invoiceId: string }>();
  const { getInvoice } = useInvoiceApi();

  const {
    data: invoice,
    isLoading,
    isError,
  } = useQuery<Invoice>({
    queryKey: ["invoice", invoiceId],
    queryFn: () => getInvoice(invoiceId),
    enabled: !!invoiceId,
  });

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
          />

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <InvoiceInfoCard invoice={invoice} />
            </div>

            <div className="space-y-4">
              <InvoiceSummaryCard invoice={invoice} />
            </div>
          </div>
        </div>
      )}
    </QueryState>
  );
};

export default InvoiceDetailPage;