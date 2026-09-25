import { CalendarDays, CalendarRange, Calendar } from "lucide-react";
import { formatCompactCurrency } from "@/utils/common.utils";
import { StatSummaryCard } from "@/common/components/StatSummaryCard";


interface InvoiceSummarySectionProps {
    monthTotal?: number;
    quarterTotal?: number;
    yearTotal?: number;
}

export const InvoiceSummarySection = ({
    monthTotal,
    quarterTotal,
    yearTotal,
}: InvoiceSummarySectionProps) => {

    return (
        <section className=" flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-3">
                <StatSummaryCard
                    variant="accent"
                    icon={<Calendar className="h-4 w-4 font-light" />}
                    label="Month To Date"
                    value={formatCompactCurrency(monthTotal)}
                    sublabel="MTD"
                />

                <StatSummaryCard
                    variant="accent"
                    icon={<CalendarRange className="h-4 w-4 font-light" />}
                    label="Quarter To Date"
                    value={formatCompactCurrency(quarterTotal)}
                    sublabel="QTD"
                />
                <StatSummaryCard
                    variant="accent"
                    icon={<CalendarDays className="h-4 w-4 font-light" />}
                    label="Year To Date"
                    value={formatCompactCurrency(yearTotal)}
                    sublabel="YTD"
                />
            </div>
        </section>
    );
};