import { AGEING_COLOR_BY_LABEL } from "@/constants/Constants"
import type { DatePreset, Invoice } from "@/types/invoice.types"

export const getAgeingColor = (label: string) => {
  const normalized = label.replace(/\s*days?$/i, "").trim()
  return AGEING_COLOR_BY_LABEL[normalized] ?? "#94A3B8"
}

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

