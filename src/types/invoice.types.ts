export interface InvoiceStatistics {
  businessPartnerId: string;
  totalInvoiced?: number;
  totalPaid?: number;
  totalOutstanding?: number;
}

export interface SearchInvoicesParams {
  businessPartnerId: string
  fromDate?: string
  toDate?: string
  query?: string
  invoiceStatus?: string
  verticals?: string[]
  page?: number
  size?: number
}


export interface InvoiceLineItem {
  itemCode: string
  itemDescription: string
  quantity: number
  measureUnit: string
  price: number
  lineTotal: number
  hsnCode?: string
}

export interface InvoicePayment {
  id: string
  date: string
  amount: number
}

export interface Invoice {
  cardCode: string
  cardName: string | null
  docDate: string
  docDueDate: string
  docEntry: number
  docTotal: number
  eDocNo: string | null
  eWayBillNumber: string | null
  invoiceNumber: string
  shipToCode: string | null
  status: string
  vertical: string
  settledDate?: string | null
  salesOrderNumbers?: string[]
  items?: InvoiceLineItem[]
  taxableValue?: number
  igstRate?: number
  igstAmount?: number
  roundOff?: number
  remarks?: string | null
  payments?: InvoicePayment[]
  buyerGstin?: string
  irn?: string
}


export type Tab = "overview" | "invoices" | "transactions"

export type InvoiceSubTab = "ALL" | "OPEN" | "CLOSED" | "OVERDUE"

export type TransactionSubTab = "ALL" | "CREDIT_NOTE" | "DEBIT_NOTE"

export type DatePreset = "ALL" | "THIS_MONTH" | "LAST_30" | "LAST_90"