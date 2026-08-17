// src/orders/components/OrderHero.tsx
import { StatusBadge } from "@/pages/order/components/StatusBadge";
import { formatDate } from "@/utils/orders.utils";
import type { OrderWithExtras } from "@/types/orderDetail.types";

interface OrderHeroProps {
  order?: OrderWithExtras;
  status: string;
}

export const OrderHero = ({ order, status }: OrderHeroProps) => (
  <div className="mb-6 flex flex-col justify-between gap-4 rounded-xl bg-secondary p-6 text-white shadow-sm sm:flex-row sm:items-center">
    <div>
      <p className="text-lg font-bold">{order?.orderNumber ?? order?.docEntry}</p>
      <p className="mt-1 text-sm text-white/80">
        Placed on {formatDate(order?.docDate)}
        {order?.itemCount ? ` · ${order.itemCount} items` : ""}
        {order?.category ? ` · ${order.category}` : ""}
      </p>
    </div>
    <StatusBadge status={status} variant="hero" />
  </div>
);