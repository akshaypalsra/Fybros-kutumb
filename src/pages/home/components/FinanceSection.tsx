import { CalendarClock, FileText, ShoppingCart } from "lucide-react";
import { formatCompactCurrency } from "@/utils/common.utils";
import { StatSummaryCard } from "@/common/components/StatSummaryCard";


interface FinanceSectionProps {
    outstandingInvoiceAmount?: number;
    overdueInvoiceAmount?: number;
    pendingOrderAmount?: number;
}

export const FinanceSection = ({
    outstandingInvoiceAmount,
    overdueInvoiceAmount,
    pendingOrderAmount,
}: FinanceSectionProps) => {
    return (
        <section className="mb-6">


            <div className="grid grid-cols-3 gap-3">
                <StatSummaryCard
                    icon={<FileText className="h-4 w-4 font-light" />}
                    label="Outstanding Balance"
                    value={formatCompactCurrency(outstandingInvoiceAmount)}
                    sublabel="As on Today"

                />

                <StatSummaryCard
                    icon={<CalendarClock className="h-4 w-4 font-light" />}
                    label="Overdue"
                    value={formatCompactCurrency(overdueInvoiceAmount)}
                    sublabel="Action needed"
                />
                <StatSummaryCard
                    icon={<ShoppingCart className="h-4 w-4 font-light" />}
                    label="Orders"
                    value={formatCompactCurrency(pendingOrderAmount)}
                    sublabel="Pending"
                />
            </div>
        </section>
    );
};