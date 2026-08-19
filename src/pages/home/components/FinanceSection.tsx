import { Link } from "react-router-dom";
import { CalendarClock, ChevronRight, FileText, Receipt } from "lucide-react";

import { formatCompactCurrency } from "@/utils/common.utils";
import { StatSummaryCard } from "@/common/components/StatSummaryCard";

interface FinanceSectionProps {
    outstandingAmount?: number;
    overdueAmount?: number;
    invoices?: number;
}

export const FinanceSection = ({
    outstandingAmount,
    overdueAmount,
    invoices,
}: FinanceSectionProps) => {
    return (
        <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-md font-heading text-foreground">
                    Finance
                </h2>

                <Link
                    to="/invoices"
                    className="h-auto gap-1 flex items-center p-0 text-sm font-medium text-secondary"
                >
                    View all <ChevronRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            <StatSummaryCard
                variant="accent"
                icon={<FileText className="h-4 w-4 font-light" />}
                label="Outstanding Balance"
                value={formatCompactCurrency(outstandingAmount)}
                sublabel="As on Today"
                className="mb-3"
            />

            <div className="grid grid-cols-2 gap-3">
                <StatSummaryCard
                    icon={<CalendarClock className="h-4 w-4 font-light" />}
                    label="Overdue"
                    value={formatCompactCurrency(overdueAmount)}
                    sublabel="Action needed"
                />
                <StatSummaryCard
                    icon={<Receipt className="h-4 w-4 font-light" />}
                    label="Invoices"
                    value={invoices != null ? String(invoices) : "0"}
                    sublabel=""
                />
            </div>
        </section>
    );
};