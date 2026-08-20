const SEMANTIC_TONE = {
  success: {
    solid: "bg-[#C9FFBC]",
    soft: "bg-[#C9FFBC] text-[#13823B] border-[#C9FFBC]",
    hero: "bg-white/90 text-[#13823B] border-transparent",
  },
  warning: {
    solid: "bg-[#FFF2BA]",
    soft: "bg-[#FFF2BA] text-[#E29400] border-[#FFF2BA]",
    hero: "bg-white/90 text-[#E29400] border-transparent",
  },
  danger: {
    solid: "bg-[#FEE2E5]/80",
    soft: "bg-[#FEE2E5] text-[#FA394B] border-[#FEE2E5]",
    hero: "bg-white/90 text-[#FA394B] border-transparent",
  },
  info: {
    solid: "bg-[#CEDEFF]/80",
    soft: "bg-[#CEDEFF] text-[#0007D3] border-[#CEDEFF]",
    hero: "bg-white/90 text-[#0007D3] border-transparent",
  },
  purple: {
    solid: "bg-[#E8D8F6]/80",
    soft: "bg-[#E8D8F6] text-[#000989] border-[#E8D8F6]",
    hero: "bg-white/90 text-[#000989] border-transparent",
  },
  neutral: {
    solid: "bg-[#E5E5E6]/80",
    soft: "bg-[#E5E5E6] text-[#58595B] border-[#E5E5E6]",
    hero: "bg-white/90 text-[#58595B] border-transparent",
  },
} as const;

type Tone = keyof typeof SEMANTIC_TONE;

const STATUS_TONE: Record<string, Tone> = {
  PAID: "success",
  DELIVERED: "success",
  FULLY_DELIVERED: "success",
  CLOSED: "success",

  PENDING: "warning",
  UNPAID: "warning",

  PARTIAL: "info",
  "PARTIALLY PAID": "info",
  "PARTIAL DELIVERY": "info",
  PARTIALLY_DELIVERED: "info",
  OPEN: "info",
  "DUE_SOON": "info",
  

  OVERDUE: "danger",


  CT: "purple",
  CP: "purple",
  CR: "purple",
  CPT: "purple",

  CANCELLED: "neutral",
};

const buildStyleMap = (variant: "solid" | "soft" | "hero") =>
  Object.fromEntries(
    Object.entries(STATUS_TONE).map(([status, tone]) => [status, SEMANTIC_TONE[tone][variant]]),
  );

export const STATUS_RAIL: Record<string, string> = buildStyleMap("solid");
export const STATUS_STYLES: Record<string, string> = buildStyleMap("soft");
export const HERO_STATUS_STYLES: Record<string, string> = buildStyleMap("hero");

export const getDaysToDue = (dueDate: string | null | undefined): number | null => {
  if (!dueDate) return null;
  const msPerDay = 1000 * 60 * 60 * 24;
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / msPerDay);
};

