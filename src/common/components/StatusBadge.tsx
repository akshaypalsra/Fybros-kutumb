import { StatusChip } from "@/common/components/StatusChip";
import {
  HERO_STATUS_STYLES,
  STATUS_RAIL,
  STATUS_STYLES,
} from "@/utils/orders.utils";

type StatusVariant = "default" | "hero" | "rail";

interface StatusBadgeProps {
  status: string | null | undefined;
  className?: string;
  variant?: StatusVariant;
  styles?: Record<string, string>;
}

interface VariantConfig {
  styleMap: Record<string, string>;
  fallbackClassName?: string;
  baseClassName?: string;
}

const VARIANT_CONFIG: Record<StatusVariant, VariantConfig> = {
  default: {
    styleMap: STATUS_STYLES,
    fallbackClassName: "bg-muted text-muted-foreground border-border",
  },

  hero: {
    styleMap: HERO_STATUS_STYLES,
    fallbackClassName: "bg-white/90 text-foreground border-transparent",
  },

  rail: {
    styleMap: STATUS_RAIL,
    baseClassName:
      "rounded-full border-0 px-2.5 py-0.5 text-[10.5px] font-bold tracking-wide capitalize",
  },
};

export const StatusBadge = ({
  status,
  className,
  variant = "default",
  styles,
}: StatusBadgeProps) => {
  const config = VARIANT_CONFIG[variant];

  return (
    <StatusChip
      status={status}
      className={className}
      styleMap={styles ?? config.styleMap}
      fallbackClassName={config.fallbackClassName}
      baseClassName={config.baseClassName}
    />
  );
};