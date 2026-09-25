import { StatSummaryCard } from "@/common/components/StatSummaryCard";
import type { OrderValue } from "@/types/order.types";
import { formatCompactCurrency } from "@/utils/common.utils";
import DeliveredImage from "../../../../assets/icons/delivered.svg";
import PendingImage from "../../../../assets/icons/pending.svg";

interface OrderStatsCardsProps {
  orderValue?: OrderValue;
  isOrderValueLoading: boolean;
}

export const OrderStatsCards = ({ orderValue, isOrderValueLoading }: OrderStatsCardsProps) => {
  // const total = orderValue?.orderValue ?? 0;
  const delivered = orderValue?.deliveredOrderValue ?? 0;
  const pending = orderValue?.pendingOrderValue ?? 0;
  // const partialDelivered = Math.max(total - delivered - pending, 0);
  return (
    <div className="mb-6 grid grid-cols-4 gap-3">
      {/* <StatSummaryCard
        variant="accent"
        icon={<img src={TotalImage} alt="" className="h-4 w-4" />}
        label="Total Order Value"
        value={formatCompactCurrency(total)}
        sublabel="Across all orders"
        isLoading={isOrderValueLoading}
      /> */}

      

      <StatSummaryCard
        icon={<img src={PendingImage} alt="" className="h-4 w-4" />}
        label="Pending"
        variant="accent"
        value={formatCompactCurrency(pending)}
        sublabel="(Inc of Tax)"
        isLoading={isOrderValueLoading}
      />

      <StatSummaryCard
        
        variant="accent"
        icon={<img src={DeliveredImage} alt="" className="h-4 w-4" />}
        label="Invoiced"
        value={formatCompactCurrency(delivered)}
               sublabel="(Inc of Tax)"
        isLoading={isOrderValueLoading}
      />

      {/* <StatSummaryCard
        icon={<img src={PendingImage} alt="" className="h-4 w-4" />}
        label="Partial Delivered"
        value={formatCompactCurrency(partialDelivered)}
        sublabel="pending value"
        isLoading={isOrderValueLoading}
      /> */}
    </div>
  )
};