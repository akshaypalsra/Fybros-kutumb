// src/orders/OrderItemDetailPage.tsx
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Download } from "lucide-react"

import { Skeleton } from "@/common/components/ui/skeleton"
import { Badge } from "@/common/components/ui/badge"
import { Button } from "@/common/components/ui/button"
import { useOrderApi } from "@/api/order/useOrderApi"
import type { OrderItemDetail } from "@/types/order.types"

const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ")




const STATUS_STYLES: Record<string, string> = {
    DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    PARTIAL: "bg-amber-100 text-amber-700 border-amber-200",
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    OPEN: "bg-white/20 text-white border-transparent",
}

const StatusBadge = ({ status, className }: { status: string; className?: string }) => (
    <Badge
        variant="outline"
        className={cn(
            "rounded-full border px-3 py-0.5 text-xs font-semibold capitalize",
            STATUS_STYLES[status] ?? "bg-white/20 text-white border-transparent",
            className,
        )}
    >
        {status.toLowerCase()}
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

const OrderItemDetailPage = () => {
    const navigate = useNavigate()
    const { orderItemId = "" } = useParams<{ orderItemId: string }>()
    const { getOrderItem } = useOrderApi()

    const {
        data: item,
        isLoading,
        isError,
    } = useQuery<OrderItemDetail>({
        queryKey: ["order-item", orderItemId],
        queryFn: () => getOrderItem(orderItemId) as unknown as Promise<OrderItemDetail>,
        enabled: !!orderItemId,
    })

    if (isLoading) {
        return (
            <div className="mx-auto max-w-6xl space-y-4 p-6">
                <Skeleton className="h-8 w-56" />
                <div className="grid gap-4 lg:grid-cols-3">
                    <Skeleton className="h-40 lg:col-span-1" />
                    <Skeleton className="h-64 lg:col-span-2" />
                </div>
            </div>
        )
    }

    if (isError || !item) {
        return (
            <div className="mx-auto max-w-6xl">
                <p className="text-sm text-destructive">Couldn&apos;t load this item. Please try again.</p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-xl font-medium tracking-tight text-foreground">Item Detail</h1>
                </div>
                <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {/* Left column — hero summary */}
                <div className="lg:col-span-1">
                    <div className="rounded-xl bg-[#E92739] p-5 text-white shadow-sm">
                        <div className="mb-3 flex items-start justify-between gap-2">
                            <p className="text-base font-bold">{item.itemCode}</p>
                            <StatusBadge status={item.deliveryStatus} className="shrink-0" />
                        </div>
                        <p className="text-sm font-medium text-white/90">{item.itemDescription}</p>
                        <p className="text-xs text-white/70">
                            Order {item.orderNumber} &middot; Line {item.lineNumber}
                        </p>
                        <p className="mt-4 text-xs text-white/70">Line Total</p>
                        <p className="text-2xl font-bold">{formatCurrency(item.lineTotal)}</p>
                    </div>
                </div>

                {/* Right column — details */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl border border-border bg-card p-5">
                        <h2 className="mb-4 text-sm font-semibold text-foreground">Details</h2>
                        <div className="space-y-0 divide-y divide-border">
                            <div className="flex items-center justify-between py-3 first:pt-0">
                                <span className="text-sm text-muted-foreground">Item Code</span>
                                <span className="text-sm font-medium text-foreground">{item.itemCode}</span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-sm text-muted-foreground">HSN Code</span>
                                <span className="text-sm font-medium text-foreground">{item.hsnCode}</span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-sm text-muted-foreground">Order Number</span>
                                <span className="text-sm font-medium text-foreground">{item.orderNumber}</span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-sm text-muted-foreground">Line Number</span>
                                <span className="text-sm font-medium text-foreground">{item.lineNumber}</span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-sm text-muted-foreground">Unit Price</span>
                                <span className="text-sm font-medium text-foreground">
                                    {formatCurrency(item.price)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-sm text-muted-foreground">Order Quantity</span>
                                <span className="text-sm font-medium text-foreground">
                                    {item.quantity} {item.measureUnit}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-sm text-muted-foreground">Delivered Quantity</span>
                                <span className="text-sm font-medium text-foreground">
                                    {item.deliveryQuantity} {item.measureUnit}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-sm text-muted-foreground">Pending Quantity</span>
                                <span className="text-sm font-medium text-foreground">
                                    {item.pendingQuantity} {item.measureUnit}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3 last:pb-0">
                                <span className="text-sm text-muted-foreground">UOM</span>
                                <span className="text-sm font-medium text-foreground">{item.measureUnit}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderItemDetailPage