import type { Invoice } from "@/types/invoice.types"

import { DetailField } from "../../../../common/components/DetailField"
import { formatDate } from "@/utils/common.utils"
import { Heading } from "@/common/components/Heading"
import { Link } from "react-router-dom"

export const InvoiceInfoCard = ({ invoice }: { invoice: Invoice }) => (
  console.log(invoice),
  <div className="rounded-md bg-card p-5">
    <Heading title={'Invoice Details'} />
    <div className="grid grid-cols-2 rounded-md bg-muted p-5  gap-x-6 gap-y-4 sm:grid-cols-3">
      <DetailField label="Bill To" value={invoice.billTo} />
      <DetailField label="Shipped To" value={invoice.shipTo} />
      <DetailField label="Vertical" value={invoice.vertical} />
      <DetailField label="Eway Bill Number" value={invoice.eWayBillNumber ?? 'N/A'} />
      <DetailField label="Invoice Date" value={formatDate(invoice.docDate)} />
      <DetailField label="Due Date" value={formatDate(invoice.docDueDate)} />
      <DetailField label="Card Code" value={invoice.cardCode} />
      <DetailField
        label="Sales order"
        value={
          invoice?.orders?.length ? (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {invoice.orders.map((o, i) => (
                <span key={o.docEntry} className="flex items-center gap-1">
                  <Link to={`/orders/${o.docEntry}`} className="text-blue-500 hover:underline">
                    {o.orderNumber}
                  </Link>
                  {i < invoice.orders.length - 1 && <span className="text-muted-foreground">,</span>}
                </span>
              ))}
            </div>
          ) : undefined
        }
      />
    </div>
  </div>
)