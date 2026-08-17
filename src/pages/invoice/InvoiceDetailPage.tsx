// src/invoices/InvoiceDetailPage.tsx
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { Skeleton } from "@/common/components/ui/skeleton"
import { useInvoiceApi } from "@/api/invoice/useInvoiceApi"
import type { Invoice } from "@/types/invoice.types"


import { InvoiceInfoCard } from "./components/InvoiceInfoCard"
import { InvoiceItemsCard } from "./components/InvoiceItemsCard"
import { TaxSummaryCard } from "./components/TaxSummaryCard"
import { InvoiceRemarksAlert } from "./components/InvoiceRemarksAlert"

import { PaymentTimelineCard } from "./components/PaymentTimelineCard"
import { GstDetailsCard } from "./components/GstDetailsCard"
import { InvoiceSummaryCard } from "./components/InvoiceSummaryCard"
import { DetailPageHeader} from "../../common/components/DetailPageHeader"

const InvoiceDetailPage = () => {
  const navigate = useNavigate()
  const { invoiceId = "" } = useParams<{ invoiceId: string }>()
  const { getInvoice } = useInvoiceApi()

  const { data: invoice, isLoading } = useQuery<Invoice>({
    queryKey: ["invoice", invoiceId],
    queryFn: () => getInvoice(invoiceId),
    enabled: !!invoiceId,
  })

  if (isLoading || !invoice) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <DetailPageHeader
        title={`Invoice ${invoice.invoiceNumber ?? invoice.docEntry}`}
        onBack={() => navigate(-1)}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <InvoiceInfoCard invoice={invoice} />

          {invoice.items && invoice.items.length > 0 && (
            <InvoiceItemsCard items={invoice.items} />
          )}

          {(invoice.taxableValue != null || invoice.igstAmount != null) && (
            <TaxSummaryCard invoice={invoice} />
          )}

          {invoice.remarks && <InvoiceRemarksAlert remarks={invoice.remarks} />}
        </div>

        <div className="space-y-4">
          <InvoiceSummaryCard invoice={invoice} />

          {invoice.payments && invoice.payments.length > 0 && (
            <PaymentTimelineCard payments={invoice.payments} />
          )}

          {(invoice.buyerGstin || invoice.irn) && <GstDetailsCard invoice={invoice} />}
        </div>
      </div>
    </div>
  )
}

export default InvoiceDetailPage