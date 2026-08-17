
const SEMANTIC_TONE = {
  success: {
    solid: "bg-emerald-400/80",
    soft: "bg-emerald-50 text-emerald-600 border-emerald-100",
    hero: "bg-white/90 text-emerald-600 border-transparent",
  },
  warning: {
    solid: "bg-amber-400/80",
    soft: "bg-amber-50 text-amber-600 border-amber-100",
    hero: "bg-white/90 text-amber-600 border-transparent",
  },
  danger: {
    solid: "bg-rose-300/80",
    soft: "bg-rose-50 text-secondary border-rose-100",
    hero: "bg-white/90 text-secondary border-transparent",
  },
  info: {
    solid: "bg-sky-300/80",
    soft: "bg-sky-50 text-sky-600 border-sky-100",
    hero: "bg-white/90 text-sky-600 border-transparent",
  },
  neutral: {
    solid: "bg-muted",
    soft: "bg-muted text-muted-foreground border-border",
    hero: "bg-white/90 text-foreground border-transparent",
  },
} as const;

type Tone = keyof typeof SEMANTIC_TONE;

const STATUS_TONE: Record<string, Tone> = {
  PAID: "success",
  DELIVERED: "success",
  FULLY_DELIVERED: "success",
  CLOSED: "success",
  PENDING: "warning",
  PARTIAL: "warning",
  "PARTIALLY PAID": "warning",
  "PARTIAL DELIVERY": "warning",
  PARTIALLY_DELIVERED: "warning",
  OPEN: "warning",
  UNPAID: "danger",
  OVERDUE: "danger",
  "DUE SOON": "info",
  CANCELLED: "neutral",
};

const buildStyleMap = (variant: "solid" | "soft" | "hero") =>
  Object.fromEntries(
    Object.entries(STATUS_TONE).map(([status, tone]) => [status, SEMANTIC_TONE[tone][variant]]),
  );

export const STATUS_RAIL: Record<string, string> = buildStyleMap("solid");
export const STATUS_STYLES: Record<string, string> = buildStyleMap("soft");
export const HERO_STATUS_STYLES: Record<string, string> = buildStyleMap("hero");


export const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export const formatCurrency = (value: number | null | undefined) =>
  value != null
    ? value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
    : "—";

export const formatCompactCurrency = (value: number | null | undefined) => {
  if (value == null) return "—";
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
};



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

export const formatMonth = (value: string | null | undefined) =>
  value ? new Date(value).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "Undated";

export const getDaysToDue = (dueDate: string | null | undefined): number | null => {
  if (!dueDate) return null;
  const msPerDay = 1000 * 60 * 60 * 24;
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / msPerDay);
};