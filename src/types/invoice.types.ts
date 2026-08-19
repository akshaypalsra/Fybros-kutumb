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

export interface InvoiceOrder {
  docEntry: number
  orderNumber: string
}

export interface Invoice {
  docEntry: number
  invoiceNumber: string
  cardCode: string
  docDate: string
  docDueDate: string
  docTotal: number
  vertical: string
  status: string
  cardName: string | null
  shipToCode: string | null
  orders: InvoiceOrder[]
  ewayBillNumber: string | null
  edocNo: string | null
}


export type Tab = "overview" | "invoices" | "ledger"

export type InvoiceSubTab = "ALL" | "OPEN" | "CLOSED" | "OVERDUE"

export type TransactionSubTab = "ALL" | "CREDIT_NOTE" | "DEBIT_NOTE"

export type DatePreset = "ALL" | "THIS_MONTH" | "LAST_30" | "LAST_90"