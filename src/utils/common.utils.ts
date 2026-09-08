export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

export const formatCurrency = (value: number | null | undefined) => value != null ? value.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }) : "—"

export const formatCompactCurrency = (value: number | null | undefined) => {
  if (value == null) return "—"
  if (value >= 10000000) return `₹ ${(value / 10000000).toFixed(2)} Cr`
  if (value >= 100000) return `₹ ${(value / 100000).toFixed(2)}L`
  if (value >= 1000) return `₹ ${(value / 1000).toFixed(2)}K`
  return formatCurrency(value)
}


export const getInvoiceAge = (docDate: string | Date): number => {
  const invoiceDate = new Date(docDate)
  const today = new Date()
  const diffMs = today.getTime() - invoiceDate.getTime()
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
}

export const formatInvoiceAge = (docDate: string | Date): string => {
  const days = getInvoiceAge(docDate)
  return `${days} day${days === 1 ? "" : "s"}`
}

export const formatDate = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "—";

export const formatDateShort = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    })
    : "—";

export const formatMonthYear = (value: string | null | undefined) => value
  ? new Date(value).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
  : "Undated";

export const getInitials = (name?: string): string => {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};