export const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

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

export const formatMonthYear = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "Undated";

export const getInitials = (name?: string): string => {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};