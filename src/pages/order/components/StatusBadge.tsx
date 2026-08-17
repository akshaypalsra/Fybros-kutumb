import { StatusChip } from "@/common/components/StatusChip";
import { HERO_STATUS_STYLES, STATUS_STYLES } from "@/utils/orders.utils";

interface StatusBadgeProps {
    status: string;
    className?: string;
    variant?: "default" | "hero";
}

export const StatusBadge = ({ status, className, variant = "default" }: StatusBadgeProps) => (
    <StatusChip
        status={status}
        className={className}
        styleMap={variant === "hero" ? HERO_STATUS_STYLES : STATUS_STYLES}
        fallbackClassName={variant === "hero" ? "bg-white/90 text-foreground border-transparent" : "bg-muted text-muted-foreground border-border"}
    />
);