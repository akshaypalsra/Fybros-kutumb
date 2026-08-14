import { Button } from "@/common/components/ui/button"

interface OrdersHeaderProps {
  partnerName: string | undefined
  partnerCode: string | undefined
  onNewOrder?: () => void
}

export const OrdersHeader = ({ partnerName, partnerCode, onNewOrder }: OrdersHeaderProps) => (
  <div className="mb-6 flex items-start justify-between gap-6">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F4C7CB] bg-[#FDE9EB] font-semibold text-[#B81E2D]">
        {(partnerName ?? "?").charAt(0)}
      </div>
      <div>
        <h1 className="text-xl font-medium tracking-tight text-foreground">Orders</h1>
        <p className="font-mono text-xs text-muted-foreground">
          {(partnerName ?? "").toUpperCase()} · {partnerCode ?? "—"}
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
)