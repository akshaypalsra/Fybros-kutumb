
import type { OrderWithExtras } from "@/types/order-detail.types";
import { formatCurrency, formatDate } from "@/utils/common.utils";

interface OrderTotalBannerProps {
  order?: OrderWithExtras;
  computedTotal: number | undefined;
}

export const OrderTotalBanner = ({ order, computedTotal }: OrderTotalBannerProps) => (
  <div className="rounded-md  bg-secondary p-5 text-white shadow-sm">
    <p className="text-sm font-medium text-white/90">{order?.orderNumber ?? order?.docEntry}</p>
    <p className="text-xs text-white/70">{formatDate(order?.docDate)}</p>
    <p className="mt-3 text-2xl font-bold">{formatCurrency(computedTotal)}</p>
  </div>
);