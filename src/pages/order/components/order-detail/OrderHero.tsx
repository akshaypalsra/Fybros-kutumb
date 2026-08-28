import { StatusBadge } from "@/common/components/StatusBadge";
import type { OrderWithExtras } from "@/types/order-detail.types";
import { formatDate } from "@/utils/common.utils";
import { cn } from "@/utils/common.utils"; // adjust import path if cn lives elsewhere

interface OrderHeroProps {
  order?: OrderWithExtras;
  status: string;
  className?: string;
  itemsSummary?: string;
}

export const OrderHero = ({ order, status, className, itemsSummary }: OrderHeroProps) => {
  const count = order?.itemCount ?? order?.totalItems;

  const summary =
    itemsSummary ??
    [
      count ? `${count} ${count === 1 ? "item" : "items"}` : undefined,
      order?.category ?? order?.vertical,
    ]
      .filter(Boolean)
      .join(" | ");

  return (
    <div
      className={cn(
        "col-span-2 flex min-h-45 flex-col justify-between rounded-md bg-secondary p-6 text-white shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-lg font-heading">
          {order?.orderNumber ?? order?.docEntry}
        </p>
        <StatusBadge status={status} variant="hero" />
      </div>

      <div className="space-y-1 text-sm text-white/80">
        <p>Placed on {formatDate(order?.docDate)}</p>
        {summary && <p>{summary}</p>}
      </div>
    </div>
  );
};