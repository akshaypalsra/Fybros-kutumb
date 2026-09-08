export interface InvoiceStatistics {
  businessPartnerId: string;
  totalInvoiced?: number;
  totalPaid?: number;
  totalOutstanding?: number;
}

export interface InvoiceItem {
  id: number;
  itemCode: string;
  itemDescription: string;
  quantity: number;
  price: number;
  lineTotal: number;
  hsnCode: string;
  measureUnit: string;
}

export interface SearchInvoicesFilters {
  fromDate?: string;
  toDate?: string;
  query?: string;
  invoiceStatus?: string;
  verticals?: string[];
}

export interface SearchInvoicesParams extends SearchInvoicesFilters {
  businessPartnerId: string;
  page?: number;
  size?: number;
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
  billTo: string
  shipTo: string
  shipToCode: string | null
  vertical: string
  status: string
  cardName: string | null
  orders: InvoiceOrder[]
  eWayBillNumber: string | null
  edocNo: string | null
}


export type Tab = "overview" | "invoices" | "ledger"

export type InvoiceSubTab = "ALL" | "UNPAID" | "PAID" | "OVERDUE"

export type TransactionSubTab = "ALL" | "CREDIT_NOTE" | "DEBIT_NOTE"

export type DatePreset = "ALL" | "THIS_MONTH" | "LAST_30" | "LAST_90"