import { Badge } from "@/common/components/ui/badge"
import { STATUS_STYLES } from "@/constants/Constants"
import { cn } from "@/utils/invoice.utils"


export const StatusBadge = ({
  status,
  styles = STATUS_STYLES,
  className,
}: {
  status: string | null | undefined
  styles?: Record<string, string>
  className?: string
}) => (
  <Badge
    variant="outline"
    className={cn(
      "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
      (status && styles[status]) ?? "bg-slate-100 text-slate-700 border-slate-200",
      className
    )}
  >
    {status ? status.toLowerCase() : "—"}
  </Badge>
)