// pages/home/components/OrderSection.tsx
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { OrderStatsCards } from "@/pages/order/components/order/OrderStatsCards";
import { useOrderValue } from "@/pages/order/hooks/useOrderValue";

interface OrderSectionProps {
    cardCode?: string;
}

export const OrderSection = ({ cardCode }: OrderSectionProps) => {
    const { orderValue, isOrderValueLoading } = useOrderValue({
        cardCode,
        dateFrom: "",
        dateTo: "",
        fromDateIso: undefined,
        toDateIso: undefined,
        query: "",
        selectedVerticals: [],
        tab: "ALL",
    });

    return (
        <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-md font-heading text-foreground">
                    Orders
                </h2>

                <Link
                    to="/Orders"
                    className="h-auto gap-1 flex items-center p-0 text-sm font-medium text-secondary"
                >
                    View all <ChevronRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            <OrderStatsCards orderValue={orderValue} isOrderValueLoading={isOrderValueLoading} />
        </section>
    );
};