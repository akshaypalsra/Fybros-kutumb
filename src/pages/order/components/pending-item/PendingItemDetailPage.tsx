import { ArrowLeft, Download } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import type { PendingItem } from "@/types/pending-item.types";
import { ErrorState } from "@/common/components/ErrorState";
import { EmptyState } from "@/common/components/EmptyState";
import { Button } from "@/common/components/ui/button";
import type { PendingItemOrderDetail } from "@/types/pending-item.types";
import { QueryState } from "@/wrapper/QueryState";
import { usePendingItemDetails } from "../../hooks/usePendingItemDetails";
import { OrdersListSkeleton } from "../order/OrdersListSkeleton";
import { PendingItemOrderRow } from "./PendingItemOrderRow";


const PendingItemDetailPage = () => {
    const { itemCode = "" } = useParams<{ itemCode: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const item: PendingItem = (location.state as { item?: PendingItem } | null)?.item ?? {
        itemCode,
        itemDescription: "",
        pendingQuantity: 0,
        orderCount: 0,
        vertical: "",
    };

    const { orders, isLoading, isError } = usePendingItemDetails(itemCode);

    return (
        <div >
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-lg font-semibold text-foreground">Item Detail</h1>
                </div>

                <Button type="button" className="gap-2 rounded-md cursor-pointer bg-secondary text-white hover:bg-secondary/90">
                    <Download className="h-4 w-4" />
                    Download
                </Button>
            </div>

            <div className="mb-6 rounded-lg bg-secondary p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-base font-semibold">{item.itemCode}</div>
                        <div className="mt-1 text-sm text-white">{item.vertical}</div>
                        <div className="text-sm text-white">{item.itemDescription}</div>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-white">
                        Pending - {item.pendingQuantity} pcs
                    </span>
                </div>
            </div>

            <QueryState<PendingItemOrderDetail[]>
                isLoading={isLoading}
                isError={isError}
                data={orders}
                loading={<OrdersListSkeleton rows={5} />}
                isEmpty={(data) => data.length === 0}
                error={<ErrorState message="Failed to load order details. Please try again." />}
                empty={<EmptyState message="No orders found for this item." />}
            >
                {() => (
                    <div className="overflow-hidden rounded-lg border border-border">
                     <div className="overflow-hidden rounded-lg border border-border">
    <table className="w-full border-collapse">
        <thead>
            <tr className="bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Sales order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Pending
                </th>
            </tr>
        </thead>
        <tbody>
            {orders.map((order, index) => (
                <PendingItemOrderRow key={`${order.orderNumber}-${index}`} order={order} />
            ))}
        </tbody>
    </table>
</div>
                    </div>
                )}
            </QueryState>
        </div>
    );
};

export default PendingItemDetailPage;