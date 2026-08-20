import type { DatePreset, InvoiceSubTab, Tab, TransactionSubTab } from "@/types/invoice.types"
import type { TabFilter } from "@/types/order.types"
import type { ItemFilter } from "@/types/order-detail.types"

export const CONSTANTS = {
  API_BASE_URL: import.meta.env.VITE_APP_API_BASE_URL,
  SSO_WEB_URL: import.meta.env.VITE_SSO_WEB_URL,
  SSO_WEB_CLIENT_ID: import.meta.env.VITE_SSO_WEB_CLIENT_ID,
  SSO_WEB_CLIENT_SECRET: import.meta.env.VITE_SSO_WEB_CLIENT_SECRET,
  API_MIN_DELAY_MS: 200,
  USER_QUERY_KEY: "user",
  ME_QUERY_KEY: "me",
}

export const AGEING_COLOR_BY_LABEL: Record<string, string> = {
  "0-30": "bg-emerald-500",
  "30-60": "bg-violet-500",
  "60-90": "bg-amber-500",
  "90+": "bg-red-500",
  ">90": "bg-red-500",
}

export const STATUS_STYLES: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",
  UNPAID: "bg-slate-100 text-slate-700 border-slate-200",
  OVERDUE: "bg-red-100 text-red-700 border-red-200",
  "DUE SOON": "bg-blue-100 text-blue-700 border-blue-200",
  "PARTIALLY PAID": "bg-amber-100 text-amber-700 border-amber-200",
}

export const TRANSACTION_STATUS_STYLES: Record<string, string> = {
  RECEIVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  BOUNCED: "bg-red-100 text-red-700 border-red-200",
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
}

export const TABS: { key: Tab; label: string; subtitle: string }[] = [
  { key: "overview", label: "Overview", subtitle: "A snapshot of your account activity" },
  { key: "invoices", label: "Invoices", subtitle: "View and manage all your invoices" },
  { key: "ledger", label: "Ledger", subtitle: "Track all transactions and balances" },
];

export const INVOICE_SUB_TABS: { key: InvoiceSubTab; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "OPEN", label: "Open" },
  { key: "CLOSED", label: "Closed" },
  { key: "OVERDUE", label: "Overdue" },
]

export const TRANSACTION_SUB_TABS: { key: TransactionSubTab; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "CREDIT_NOTE", label: "Credit Notes" },
  { key: "DEBIT_NOTE", label: "Debit Notes" },
]

export const DATE_PRESETS: { key: DatePreset; label: string }[] = [
  { key: "ALL", label: "All time" },
  { key: "THIS_MONTH", label: "This month" },
  { key: "LAST_30", label: "Last 30 days" },
  { key: "LAST_90", label: "Last 90 days" },
]


export const ITEM_FILTERS: ItemFilter[] = ["ALL", "DELIVERED", "PENDING"];

export const TAB_FILTERS: TabFilter[] = ["ALL", "OPEN", "CLOSED"];