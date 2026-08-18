import { useNavigate, useParams } from "react-router-dom";
import { useOrderItemDetail } from "./hooks/useOrderItemDetail";
import { OrderItemDetailSkeleton } from "./components/order-item-detail/OrderItemDetailSkeleton";
import { OrderItemDetailError } from "./components/order-item-detail/OrderItemDetailError";
import { OrderItemHeroCard } from "./components/order-item-detail/OrderItemHeroCard";
import { OrderItemDetailsList } from "./components/order-item-detail/OrderItemDetailsList";
import { DetailPageHeader } from "@/common/components/DetailPageHeader";

import type { OrderItemDetail } from "@/types/order.types";
import { QueryState } from "@/wrapper/QueryState";

const OrderItemDetailPage = () => {
    const navigate = useNavigate();
    const { orderItemId = "" } = useParams<{ orderItemId: string }>();
    const { data: item, isLoading, isError } = useOrderItemDetail(orderItemId);

    return (
        <QueryState<OrderItemDetail>
            isLoading={isLoading}
            isError={isError}
            data={item}
            loading={<OrderItemDetailSkeleton />}
            error={<OrderItemDetailError />}
        >
            {(item) => (
                <div className="mx-auto max-w-6xl">
                    <DetailPageHeader
                        title="Item Detail"
                        onBack={() => navigate(-1)}
                    />
                    <div className="grid gap-4 lg:grid-cols-3">
                        <div className="lg:col-span-1">
                            <OrderItemHeroCard item={item} />
                        </div>
                        <div className="lg:col-span-2">
                            <OrderItemDetailsList item={item} />
                        </div>
                    </div>
                </div>
            )}
        </QueryState>
    );
};

export default OrderItemDetailPage;