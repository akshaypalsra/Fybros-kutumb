// src/orders/OrderDetailPage.tsx
import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Download } from "lucide-react"

import { Skeleton } from "@/common/components/ui/skeleton"
import { Badge } from "@/common/components/ui/badge"
import { Button } from "@/common/components/ui/button"
import { useOrderApi } from "@/api/order/useOrderApi"
import type { Order, OrderItem } from "@/types/order.types"

// Local fallback — swap for your project's real `cn` helper (commonly at
// "@/lib/utils") if you have one.
const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ")



const STATUS_STYLES: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",
  DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  UNPAID: "bg-red-100 text-[#E92739] border-red-200",
  OVERDUE: "bg-[#E92739] text-white border-[#E92739]",
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  PARTIAL: "bg-amber-100 text-amber-700 border-amber-200",
  "PARTIALLY PAID": "bg-amber-100 text-amber-700 border-amber-200",
}

const StatusBadge = ({ status, className }: { status: string; className?: string }) => (
  <Badge
    variant="outline"
    className={cn(
      "rounded-full border px-3 py-0.5 text-xs font-semibold capitalize",
      STATUS_STYLES[status] ?? "bg-muted text-muted-foreground border-border",
      className
    )}
  >
    {status.toLowerCase()}
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

const OrderDetailPage = () => {
  const navigate = useNavigate()
  const { orderId = "" } = useParams<{ orderId: string }>()
  const { getOrder, getOrderItems } = useOrderApi()

  const { data: order, isLoading: isOrderLoading } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId) as unknown as Promise<Order>,
    enabled: !!orderId,
  })

  const { data: items, isLoading: isItemsLoading } = useQuery<OrderItem[]>({
    queryKey: ["order-items", orderId],
    queryFn: () => getOrderItems(orderId) as unknown as Promise<OrderItem[]>,
    enabled: !!orderId,
  })

  const computedTotal =
    order?.docTotal ?? items?.reduce((sum, item) => sum + (item.lineTotal ?? 0), 0)

  if (isOrderLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {order?.orderNumber ?? order?.docEntry}
            </h1>
            <p className="text-sm text-muted-foreground">
              {formatDate(order?.docDate)}
              {order?.docDueDate ? ` · Due ${formatDate(order.docDueDate)}` : ""}
            </p>
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left column — details + items */}
        <div className="space-y-4 lg:col-span-2">
          {(order?.cardName || order?.shipToCode) && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-4 text-sm font-semibold text-foreground">Order Details</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                {order?.cardName && (
                  <div>
                    <p className="text-xs text-muted-foreground">Buyer</p>
                    <p className="text-sm font-medium text-foreground">{order.cardName}</p>
                  </div>
                )}
                {order?.shipToCode && (
                  <div>
                    <p className="text-xs text-muted-foreground">Shipped To</p>
                    <p className="text-sm font-medium text-foreground">{order.shipToCode}</p>
                  </div>
                )}
                {order?.cardCode && (
                  <div>
                    <p className="text-xs text-muted-foreground">Card Code</p>
                    <p className="text-sm font-medium text-foreground">{order.cardCode}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Item Details</h2>

            {isItemsLoading && (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            )}

            {!isItemsLoading && items?.length === 0 && (
              <p className="text-sm text-muted-foreground">No items found.</p>
            )}

            {!isItemsLoading && items && items.length > 0 && (
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <Link
                    key={item.id}
                    to={`/orders/${orderId}/items/${item.id}`}
                    className="relative block rounded-lg py-4 transition-colors first:pt-0 last:pb-0 hover:bg-muted/50"
                  >
                    <StatusBadge status={item.deliveryStatus} className="absolute right-0 top-4" />
                    <div className="flex items-baseline justify-between pr-24">
                      <p className="text-sm font-semibold text-foreground">{item.itemCode}</p>
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(item.lineTotal)}
                      </p>
                    </div>
                    <p className="mt-0.5 text-sm text-foreground">{item.itemDescription}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.quantity} {item.measureUnit} @ {formatCurrency(item.price)} each
                      {item.remainingOpenQuantity > 0 && (
                        <span className="ml-1">
                          · {item.remainingOpenQuantity} {item.measureUnit} open
                        </span>
                      )}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>


        <div className="space-y-4">
          <div className="rounded-xl bg-[#E92739] p-5 text-white shadow-sm">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white/90">
                  {order?.orderNumber ?? order?.docEntry}
                </p>
                <p className="text-xs text-white/70">{formatDate(order?.docDate)}</p>
              </div>
              <StatusBadge
                status={order?.status ?? "—"}
                className="border-0 bg-white/20 text-white"
              />
            </div>
            <p className="text-2xl font-bold">{formatCurrency(computedTotal)}</p>
          </div>

          {items && items.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium text-foreground">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivered</span>
                  <span className="font-medium text-foreground">
                    {items.filter((i) => i.deliveryStatus === "DELIVERED").length} / {items.length}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-semibold text-[#E92739]">
                    {formatCurrency(computedTotal)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage