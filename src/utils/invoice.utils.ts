import { AGEING_COLOR_BY_LABEL } from "@/constants/Constants"
import type { DatePreset, Invoice } from "@/types/invoice.types"


export const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ")

export const getAgeingColor = (label: string) => {
  const normalized = label.replace(/\s*days?$/i, "").trim()
  return AGEING_COLOR_BY_LABEL[normalized] ?? "bg-slate-400"
}

export const formatCurrency = (value: number | null | undefined) =>
  value != null
    ? value.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
    : "—"

export const formatCompactCurrency = (value: number | null | undefined) => {
  if (value == null) return "—"
  if (value >= 100000) return `₹ ${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `₹ ${(value / 1000).toFixed(0)}K`
  return formatCurrency(value)
}

export const formatDate = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })
    : "—"

export const formatMonthYear = (value: string | null | undefined) =>
  value ? new Date(value).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "Undated"

export const getInvoiceDueLabel = (invoice: Invoice) => {
  if (invoice.status === "PAID") return "Paid"
  if (!invoice.docDueDate) return ""
  const due = new Date(invoice.docDueDate)
  const today = new Date()
  due.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays > 0) return `${diffDays} day${diffDays === 1 ? "" : "s"} to due`
  if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? "" : "s"} past due`
  return "Due today"
}

export const getDateCutoff = (preset: DatePreset): Date | null => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  if (preset === "THIS_MONTH") return new Date(now.getFullYear(), now.getMonth(), 1)
  if (preset === "LAST_30") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  if (preset === "LAST_90") return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  return null
}