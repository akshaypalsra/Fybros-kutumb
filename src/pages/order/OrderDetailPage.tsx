// src/orders/OrderDetailPage.tsx
import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Download, FileText } from "lucide-react"

import { Skeleton } from "@/common/components/ui/skeleton"
import { Badge } from "@/common/components/ui/badge"
import { Button } from "@/common/components/ui/button"
import { useOrderApi } from "@/api/order/useOrderApi"
import type { Order, OrderItem } from "@/types/order.types"
import type { Invoice } from "@/types/invoice.types"



const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ")



interface OrderDetailExtras {
  itemCount?: number
  category?: string
  orderType?: string
  deliveredValue?: number
}

type OrderWithExtras = Order & OrderDetailExtras

const STATUS_STYLES: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",
  DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  UNPAID: "bg-red-100 text-secondary border-red-200",
  OVERDUE: "bg-red-100 text-secondary border-red-200",
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  PARTIAL: "bg-amber-100 text-amber-700 border-amber-200",
  "PARTIALLY PAID": "bg-amber-100 text-amber-700 border-amber-200",
  "PARTIAL DELIVERY": "bg-amber-100 text-amber-700 border-amber-200",
  "DUE SOON": "bg-blue-100 text-blue-700 border-blue-200",
  CANCELLED: "bg-muted text-muted-foreground border-border",
}


const HERO_STATUS_STYLES: Record<string, string> = {
  "PARTIAL DELIVERY": "bg-white/90 text-secondary border-transparent",
  DELIVERED: "bg-white/90 text-emerald-700 border-transparent",
  PENDING: "bg-white/90 text-amber-700 border-transparent",
}

const StatusBadge = ({
  status,
  className,
  variant = "default",
}: {
  status: string
  className?: string
  variant?: "default" | "hero"
}) => (
  <Badge
    variant="outline"
    className={cn(
      "rounded-full border px-3 py-0.5 text-xs font-semibold capitalize",
      variant === "hero"
        ? (HERO_STATUS_STYLES[status] ?? "bg-white/90 text-foreground border-transparent")
        : (STATUS_STYLES[status] ?? "bg-muted text-muted-foreground border-border"),
      className,
    )}
  >
    {status.toLowerCase().replace(/_/g, " ")}
  </Badge>
)

const formatCurrency = (value: number | null | undefined) =>
  value != null
    ? value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
    : "—"

const formatDate = (value: string | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "—"

// Positive = days remaining, negative = days overdue. The API doesn't send
// this directly, so it's derived from `docDueDate` at render time.
const getDaysToDue = (dueDate: string | null | undefined): number | null => {
  if (!dueDate) return null
  const msPerDay = 1000 * 60 * 60 * 24
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((due.getTime() - today.getTime()) / msPerDay)
}

type ItemFilter = "ALL" | "DELIVERED" | "PENDING"

const OrderDetailPage = () => {
  const navigate = useNavigate()
  const { orderId = "" } = useParams<{ orderId: string }>()
  const { getOrder, getOrderItems, getOrderInvoices } = useOrderApi()
  const [itemFilter, setItemFilter] = useState<ItemFilter>("ALL")

  const { data: order, isLoading: isOrderLoading } = useQuery<OrderWithExtras>({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId) as unknown as Promise<OrderWithExtras>,
    enabled: !!orderId,
  })

  const { data: items, isLoading: isItemsLoading } = useQuery<OrderItem[]>({
    queryKey: ["order-items", orderId],
    queryFn: () => getOrderItems(orderId) as unknown as Promise<OrderItem[]>,
    enabled: !!orderId,
  })

  const { data: invoices, isLoading: isInvoicesLoading } = useQuery<Invoice[]>({
    queryKey: ["order-invoices", orderId],
    queryFn: () => getOrderInvoices(orderId) as unknown as Promise<Invoice[]>,
    enabled: !!orderId,
  })

  const computedTotal =
    order?.docTotal ?? items?.reduce((sum, item) => sum + (item.lineTotal ?? 0), 0)

  const counts = useMemo(() => {
    const delivered = items?.filter((i) => i.deliveryStatus === "DELIVERED").length ?? 0
    const pending =
      items?.filter((i) => i.deliveryStatus !== "DELIVERED" && i.deliveryStatus !== "CANCELLED")
        .length ?? 0
    const cancelled = items?.filter((i) => i.deliveryStatus === "CANCELLED").length ?? 0
    const total = Math.max(delivered + pending + cancelled, 1)
    return {
      delivered,
      pending,
      cancelled,
      deliveredPct: Math.round((delivered / total) * 100),
      pendingPct: Math.round((pending / total) * 100),
      cancelledPct: Math.round((cancelled / total) * 100),
    }
  }, [items])

  const filteredItems = useMemo(() => {
    if (!items) return []
    if (itemFilter === "ALL") return items
    if (itemFilter === "DELIVERED") return items.filter((i) => i.deliveryStatus === "DELIVERED")
    return items.filter((i) => i.deliveryStatus !== "DELIVERED" && i.deliveryStatus !== "CANCELLED")
  }, [items, itemFilter])

  const overallStatus =
    counts.cancelled + counts.pending === 0
      ? "DELIVERED"
      : counts.delivered === 0
        ? "PENDING"
        : "PARTIAL DELIVERY"

  if (isOrderLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl pb-24">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-medium tracking-tight text-foreground">Order Detail</h1>
        </div>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Hero */}
      <div className="mb-6 flex flex-col justify-between gap-4 rounded-xl bg-secondary p-6 text-white shadow-sm sm:flex-row sm:items-center">
        <div>
          <p className="text-lg font-bold">{order?.orderNumber ?? order?.docEntry}</p>
          <p className="mt-1 text-sm text-white/80">
            Placed on {formatDate(order?.docDate)}
            {order?.itemCount ? ` · ${order.itemCount} items` : ""}
            {order?.category ? ` · ${order.category}` : ""}
          </p>
        </div>
        <StatusBadge status={overallStatus} variant="hero" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {order?.cardName && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-4 text-sm font-semibold text-foreground">Order Details</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Buyer</p>
                  <p className="text-sm font-medium text-foreground">{order.cardName}</p>
                </div>
                {order?.cardCode && (
                  <div>
                    <p className="text-xs text-muted-foreground">Card Code</p>
                    <p className="text-sm font-medium text-foreground">{order.cardCode}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {(isInvoicesLoading || (invoices && invoices.length > 0)) && (
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Invoices</h2>
                {invoices && (
                  <span className="text-xs text-muted-foreground">
                    ({invoices.length} Invoices)
                  </span>
                )}
              </div>

              {isInvoicesLoading && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              )}

              {!isInvoicesLoading && invoices && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {invoices.map((invoice) => {
                    const daysToDue = getDaysToDue(invoice.docDueDate)
                    return (
                      <Link to={`/invoices/${invoice.docEntry}`}>
                          <div
                            key={invoice.docEntry}
                            className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-muted text-muted-foreground">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {invoice.invoiceNumber}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(invoice.docDate)} · Due {formatDate(invoice.docDueDate)}
                              </p>
                              {daysToDue != null && invoice.status !== "CANCELLED" && (
                                <p className="text-xs text-muted-foreground">
                                  {daysToDue >= 0
                                    ? `${daysToDue} day${daysToDue === 1 ? "" : "s"} to due`
                                    : `${Math.abs(daysToDue)} day${Math.abs(daysToDue) === 1 ? "" : "s"} overdue`}
                                </p>
                              )}
                              {invoice.vertical && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {invoice.vertical}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <p className="text-sm font-semibold text-foreground">
                              {formatCurrency(invoice.docTotal)}
                            </p>
                            <StatusBadge status={invoice.status} />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>

              )}
            </div>
          )}

          {/* Items */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Items {items ? `(${items.length})` : ""}
              </h2>
              <div className="flex items-center gap-1 rounded-full border border-border bg-muted/40 p-1">
                {(["ALL", "DELIVERED", "PENDING"] as ItemFilter[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setItemFilter(filter)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
                      itemFilter === filter
                        ? "bg-secondary text-white"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {filter === "ALL" ? "All" : filter.charAt(0) + filter.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {isItemsLoading && (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            )}

            {!isItemsLoading && filteredItems.length === 0 && (
              <p className="text-sm text-muted-foreground">No items found.</p>
            )}

            {!isItemsLoading && filteredItems.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredItems.map((item) => (
                  <Link
                    key={item.id}
                    to={`/orders/${orderId}/items/${item.id}`}
                    className="relative block rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <StatusBadge status={item.deliveryStatus} className="absolute right-4 top-4" />
                    <div className="flex items-baseline justify-between pr-24">
                      <p className="text-sm font-semibold text-foreground">{item.itemCode}</p>
                    </div>
                    <p className="mt-0.5 pr-4 text-sm text-foreground">{item.itemDescription}</p>
                    <div className="mt-2 flex items-baseline justify-between">
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} {item.measureUnit} @ {formatCurrency(item.price)} each
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(item.lineTotal)}
                      </p>
                    </div>
                    {item.remainingOpenQuantity > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.remainingOpenQuantity} {item.measureUnit} pending
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>


        <div className="space-y-4">
          <div className="rounded-xl bg-secondary p-5 text-white shadow-sm">
            <p className="text-sm font-medium text-white/90">
              {order?.orderNumber ?? order?.docEntry}
            </p>
            <p className="text-xs text-white/70">{formatDate(order?.docDate)}</p>
            <p className="mt-3 text-2xl font-bold">{formatCurrency(computedTotal)}</p>
          </div>

          {items && items.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-4 text-sm font-semibold text-foreground">Summary</h2>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Delivered</p>
                  <p className="text-lg font-bold text-foreground">{counts.delivered}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-lg font-bold text-foreground">{counts.pending}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Cancelled</p>
                  <p className="text-lg font-bold text-foreground">{counts.cancelled}</p>
                </div>
              </div>

              <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${counts.deliveredPct}%` }}
                />
                <div className="h-full bg-amber-500" style={{ width: `${counts.pendingPct}%` }} />
                <div className="h-full bg-secondary" style={{ width: `${counts.cancelledPct}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-emerald-600">{counts.deliveredPct}% Delivered</span>
                <span className="text-amber-600">{counts.pendingPct}% Pending</span>
                <span className="text-secondary">{counts.cancelledPct}% Cancelled</span>
              </div>

              <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date</span>
                  <span className="font-medium text-foreground">{formatDate(order?.docDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Items</span>
                  <span className="font-medium text-foreground">{items.length}</span>
                </div>
                {order?.orderType && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Type</span>
                    <Badge
                      variant="outline"
                      className="rounded-full border-purple-200 bg-purple-100 px-2.5 py-0 text-xs font-semibold text-purple-700"
                    >
                      {order.orderType}
                    </Badge>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-semibold text-foreground">Order Value</span>
                  <span className="font-semibold text-secondary">
                    {formatCurrency(computedTotal)}
                  </span>
                </div>
                {order?.deliveredValue != null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivered Order</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(order.deliveredValue)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}


          <div className="flex gap-3">
            <Button className="flex-1 bg-secondary text-white hover:bg-secondary/90">
              Track Pending Items
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-secondary text-secondary hover:bg-red-50"
            >
              Reorder Cancelled Items
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage