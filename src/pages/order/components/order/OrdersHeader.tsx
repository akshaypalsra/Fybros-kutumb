import { IdentityHeader } from "@/common/components/IdentityHeader";
import { Button } from "@/common/components/ui/button";


interface OrdersHeaderProps {
  partnerName: string | undefined;
  partnerCode: string | undefined;
  onNewOrder?: () => void;
}

export const OrdersHeader = ({ onNewOrder }: OrdersHeaderProps) => (
  <div className="mb-6 flex items-start justify-between gap-6">
    <IdentityHeader showAvatar={false} name='Orders' subtitle='Manage and track all your orders' />
    <Button
      type="button"
      onClick={onNewOrder}
      className="whitespace-nowrap rounded-lg bg-secondary px-4 py-2.5 text-sm font-normal text-white hover:bg-secondary"
    >
      + Create Order
    </Button>
  </div>
);