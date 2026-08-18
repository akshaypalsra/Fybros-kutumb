import { Badge } from "@/common/components/ui/badge";
import { cn } from "@/utils/common.utils";


interface StatusChipProps {
  status: string | null | undefined;
  styleMap: Record<string, string>;
  fallbackClassName?: string;
  className?: string;
  baseClassName?: string;
}

const formatStatusLabel = (status: string) => status.replaceAll("_", " ").toLowerCase();

export const StatusChip = ({
  status,
  styleMap,
  fallbackClassName = "bg-muted text-muted-foreground",
  className,
  baseClassName = "rounded-full border px-3 py-0.5 text-xs font-semibold capitalize",
}: StatusChipProps) => (
  <Badge
    variant="outline"
    className={cn(baseClassName, status ? (styleMap[status] ?? fallbackClassName) : fallbackClassName, className)}
  >
    {status ? formatStatusLabel(status) : "—"}
  </Badge>
);