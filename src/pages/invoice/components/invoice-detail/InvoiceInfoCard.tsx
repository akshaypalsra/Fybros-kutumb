import type { Invoice } from "@/types/invoice.types"

import { DetailField } from "../../../../common/components/DetailField"
import { formatDate } from "@/utils/common.utils"
import { Heading } from "@/common/components/Heading"

export const InvoiceInfoCard = ({ invoice }: { invoice: Invoice }) => (
  <div className="rounded-md bg-card p-5">
    <Heading title={'Invoice Details'}/>
    <div className="grid grid-cols-2 rounded-md bg-muted p-5  gap-x-6 gap-y-4 sm:grid-cols-3">
      <DetailField label="Buyer" value={invoice.cardName ?? invoice.cardCode} />
      <DetailField label="Shipped To" value={invoice.shipToCode} />
      <DetailField label="Vertical" value={invoice.vertical} />
      <DetailField label="Invoice Date" value={formatDate(invoice.docDate)} />
      <DetailField label="Due Date" value={formatDate(invoice.docDueDate)} />
      <DetailField label="Card Code" value={invoice.cardCode} />
    </div>
  </div>
)