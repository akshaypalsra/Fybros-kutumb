// src/orders/OrdersPage.tsx
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Badge } from "@/common/components/ui/badge"
import { Skeleton } from "@/common/components/ui/skeleton"
import { useOrderApi } from "@/api/order/useOrderApi"
import { useBusinessPartnerApi } from "@/api/business/useBusinessPartnerApi"

const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ")

interface Order {
  docEntry: number
  docNum: number
  orderNumber: string
  docDate: string
  docDueDate: string
  cardCode: string
  cardName: string
  fatherCard: string
  docTotal: number
  documentStatus: string
  cancelled: string
  comments: string
  totalItems: number
  totalQuantity: number
  deliveredQuantity: number
  pendingQuantity: number
  cancelledQuantity: number
  fulfilledPercentage: number
  openOrderValue: number
  vertical: string
  orderStatus: "OPEN" | "CLOSED" | "CANCELLED" | string
  orderDeliveryStatus: "OPEN" | "FULLY_DELIVERED" | "PARTIALLY_DELIVERED" | string
  orderType: string
}

const STATUS_STYLES: Record<string, string> = {
  CLOSED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  FULLY_DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  OPEN: "bg-amber-100 text-amber-700 border-amber-200",
  PARTIALLY_DELIVERED: "bg-amber-100 text-amber-700 border-amber-200",
  CANCELLED: "bg-red-100 text-[#E92739] border-red-200",
}

const StatusBadge = ({ status, className }: { status: string | null | undefined; className?: string }) => (
  <Badge
    variant="outline"
    className={cn(
      "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
      status ? STATUS_STYLES[status] ?? "bg-muted text-muted-foreground border-border" : "bg-muted text-muted-foreground border-border",
      className
    )}
  >
    {status ? status.replaceAll("_", " ").toLowerCase() : "—"}
  </Badge>
)

const formatCurrency = (value: number | null | undefined) =>
  value != null
    ? value.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
    : "—"

const formatDate = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })
    : "—"

const OrdersPage = () => {
  const { getBusinessPartners } = useBusinessPartnerApi()
  const { searchOrders } = useOrderApi()

  const { data: partner, isLoading: isPartnerLoading } = useQuery({
    queryKey: ["business-partner"],
    queryFn: () => getBusinessPartners(),
  })

  const businessPartnerId = partner?.cardCode ?? ""

  const {
    data: orders,
    isLoading: isOrdersLoading,
    isError,
  } = useQuery<Order[]>({
    queryKey: ["orders", businessPartnerId],
    queryFn: () => searchOrders(businessPartnerId) as unknown as Promise<Order[]>,
    enabled: !!businessPartnerId,
  })

  const isLoading = isPartnerLoading || isOrdersLoading

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
        Orders
      </h1>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Failed to load orders. Please try again.
        </p>
      )}

      {!isLoading && !isError && orders?.length === 0 && (
        <p className="text-sm text-muted-foreground">No orders found.</p>
      )}

      {!isLoading && !isError && orders && orders.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Link
              key={order.docEntry}
              to={`/orders/${order.docEntry}`}
              className="block rounded-xl bg-[#E92739] p-5 text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{order.orderNumber}</p>
                  <p className="text-xs text-white/70">
                    {formatDate(order.docDate)} &middot; {order.totalItems} items
                  </p>
                </div>
                <StatusBadge
                  status={order.orderStatus}
                  className="shrink-0 border-0 bg-white/20 text-white"
                />
              </div>

              <p className="mb-3 truncate text-xs text-white/80">
                {order.cardName ?? order.cardCode}
              </p>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-lg font-bold leading-tight">
                    {formatCurrency(order.docTotal)}
                  </p>
                  {order.openOrderValue > 0 && (
                    <p className="text-xs text-white/70">
                      {formatCurrency(order.openOrderValue)} open
                    </p>
                  )}
                </div>
                <StatusBadge
                  status={order.orderDeliveryStatus}
                  className="border-0 bg-white/20 text-white"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage