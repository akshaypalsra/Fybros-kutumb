import { Button } from "@/common/components/ui/button";
import { PartnerAvatar } from "@/common/components/PartnerAvatar";

interface OrdersHeaderProps {
  partnerName: string | undefined;
  partnerCode: string | undefined;
  onNewOrder?: () => void;
}

export const OrdersHeader = ({ partnerName, partnerCode, onNewOrder }: OrdersHeaderProps) => (
  <div className="mb-6 flex items-start justify-between gap-6">
    <div className="flex items-center gap-3">
      <PartnerAvatar partnerName={partnerName} />
      <div>
        <h1 className="text-lg font-normal leading-tight text-foreground">Orders</h1>
        <p className=" text-xs text-muted-foreground">
          {(partnerName ?? "")} · {partnerCode ?? "—"}
        </p>
      </div>
    </div>
    <Button
      type="button"
      onClick={onNewOrder}
      className="whitespace-nowrap rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background hover:bg-[#B81E2D]"
    >
      + New Order
    </Button>
  </div>
);