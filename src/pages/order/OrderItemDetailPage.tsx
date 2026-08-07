// src/orders/OrderItemDetailPage.tsx
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { Skeleton } from "@/common/components/ui/skeleton"
import { Badge } from "@/common/components/ui/badge"
import { Button } from "@/common/components/ui/button"
import { useOrderApi } from "@/api/order/useOrderApi"
import type { OrderItemDetail } from "@/types/order.types"


const cn = (...classes: (string | false | null | undefined)[]) =>
    classes.filter(Boolean).join(" ")


const STATUS_STYLES: Record<string, string> = {
    DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    PARTIAL: "bg-amber-100 text-amber-700 border-amber-200",
    OPEN: "bg-white/20 text-white border-transparent",
}

const StatusBadge = ({ status, className }: { status: string; className?: string }) => (
    <Badge
        variant="outline"
        className={cn(
            "rounded-full border px-3 py-0.5 text-xs font-semibold capitalize",
            STATUS_STYLES[status] ?? "bg-white/20 text-white border-transparent",
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

const OrderItemDetailPage = () => {
    const navigate = useNavigate()
    const { orderItemId = "" } = useParams<{ orderItemId: string }>()
    const { getOrderItem } = useOrderApi()

    const { data: item, isLoading, isError } = useQuery<OrderItemDetail>({
        queryKey: ["order-item", orderItemId],
        queryFn: () => getOrderItem(orderItemId) as unknown as Promise<OrderItemDetail>,
        enabled: !!orderItemId,
    })

    if (isLoading) {
        return (
            <div className="mx-auto max-w-3xl space-y-4 p-6">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
        )
    }

    if (isError || !item) {
        return (
            <div className="mx-auto max-w-3xl p-6">
                <p className="text-sm text-destructive">
                    Couldn&apos;t load this item. Please try again.
                </p>
            </div>
        )
    }

    const fulfilledQuantity = item.deliveryQuantity ?? 0
    const totalQuantity = item.quantity ?? 0
    const fulfilledPercentage =
        totalQuantity > 0 ? Math.round((fulfilledQuantity / totalQuantity) * 100) : 0

    return (
        <div className="mx-auto max-w-6xl p-6">

            <div className="mb-6 flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-foreground">{item.itemCode}</h1>
                    <p className="text-sm text-muted-foreground">
                        Order {item.orderNumber} &middot; Line {item.lineNumber}
                    </p>
                </div>
            </div>

            <div className="mb-4 rounded-xl bg-[#E92739] p-5 text-white shadow-sm">
                <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{item.itemDescription}</p>
                        <p className="text-xs text-white/70">
                            {item.quantity} {item.measureUnit} @ {formatCurrency(item.price)} each
                        </p>
                    </div>
                    <StatusBadge status={item.deliveryStatus} className="shrink-0" />
                </div>
                <p className="text-xs text-white/70">Line Total</p>
                <p className="text-2xl font-bold">{formatCurrency(item.lineTotal)}</p>
            </div>

            {/* Delivery progress */}
            <div className="mb-4 rounded-xl border border-border bg-card p-5">
                <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">Delivery Progress</h2>
                    <span className="text-sm font-medium text-foreground">{fulfilledPercentage}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-[#E92739]"
                        style={{ width: `${Math.min(fulfilledPercentage, 100)}%` }}
                    />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-xs text-muted-foreground">Ordered</p>
                        <p className="text-sm font-semibold text-foreground">
                            {item.quantity} {item.measureUnit}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Delivered</p>
                        <p className="text-sm font-semibold text-foreground">
                            {item.deliveryQuantity} {item.measureUnit}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Pending</p>
                        <p className="text-sm font-semibold text-foreground">
                            {item.pendingQuantity} {item.measureUnit}
                        </p>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-4 text-sm font-semibold text-foreground">Item Details</h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                    <div>
                        <p className="text-xs text-muted-foreground">Item Code</p>
                        <p className="text-sm font-medium text-foreground">{item.itemCode}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">HSN Code</p>
                        <p className="text-sm font-medium text-foreground">{item.hsnCode}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Order Number</p>
                        <p className="text-sm font-medium text-foreground">{item.orderNumber}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Line Number</p>
                        <p className="text-sm font-medium text-foreground">{item.lineNumber}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Unit Price</p>
                        <p className="text-sm font-medium text-foreground">{formatCurrency(item.price)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Unit of Measure</p>
                        <p className="text-sm font-medium text-foreground">{item.measureUnit}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderItemDetailPage