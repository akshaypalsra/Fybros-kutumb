import { Button } from "@/common/components/ui/button";
import { UserAvatar } from "@/common/components/UserAvatar";
import { cn } from "@/lib/utils";


interface OrdersHeaderProps {
  partnerName: string | undefined;
  partnerCode: string | undefined;
  onNewOrder?: () => void;
}

export const OrdersHeader = ({ partnerName, partnerCode, onNewOrder }: OrdersHeaderProps) => (
  <div className="mb-6 flex items-start justify-between gap-6">
    <div className="flex items-center gap-3">
      <UserAvatar
        name={partnerName}
        className={cn("h-11 w-11")}
        fallbackClassName="bg-secondary/10 text-lg font-bold text-secondary"
        fallbackVariant="first-letter"
      />
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
      className="whitespace-nowrap rounded-lg bg-secondary px-4 py-2.5 text-sm font-normal text-white hover:bg-secondary"
    >
      + New Order
    </Button>
  </div>
);