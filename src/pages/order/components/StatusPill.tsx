// src/orders/components/StatusPill.tsx
import { Badge } from "@/common/components/ui/badge"
import { cn } from "@/utils/orders.utils"


const STATUS_PILL: Record<string, string> = {
  CLOSED: "bg-emerald-50 text-emerald-700",
  FULLY_DELIVERED: "bg-emerald-50 text-emerald-700",
  OPEN: "bg-amber-50 text-amber-700",
  PARTIALLY_DELIVERED: "bg-blue-50 text-blue-700",
  CANCELLED: "bg-red-50 text-[#B4222E]",
}

interface StatusPillProps {
  status: string | null | undefined
}

export const StatusPill = ({ status }: StatusPillProps) => (
  <Badge
    variant="outline"
    className={cn(
      "rounded-full border-0 px-2.5 py-0.5 text-[10.5px] font-bold tracking-wide capitalize",
      status ? STATUS_PILL[status] ?? "bg-muted text-muted-foreground" : "bg-muted text-muted-foreground"
    )}
  >
    {status ? status.replaceAll("_", " ").toLowerCase() : "—"}
  </Badge>
)