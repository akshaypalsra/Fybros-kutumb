import { Heading } from "@/common/components/Heading";

interface TaxSummaryProps {
    taxableValue: number;
    gst: number;
    roundOff: number;
    totalInvoiceValue: number;
}

const formatCurrency = (value: number) =>
    `₹ ${value.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;

export default function TaxSummary({
    taxableValue,
    gst,
    roundOff,
    totalInvoiceValue,
}: TaxSummaryProps) {
    return (
        <section className="rounded-md bg-card p-5 text-card-foreground">
            <Heading title={'Tax Summary'} />

            <div className="rounded-md bg-muted p-5">
                <div className="space-y-4">
                    <SummaryRow
                        label="Taxable value"
                        value={formatCurrency(taxableValue)}
                    />

                    <SummaryRow
                        label="IGST @ 18%"
                        value={formatCurrency(gst)}
                    />

                    <SummaryRow
                        label="Round off"
                        value={`${roundOff < 0 ? "−" : ""} ₹ ${Math.abs(roundOff).toFixed(2)}`}
                    />

                    <SummaryRow
                        label="Total invoice value"
                        value={formatCurrency(totalInvoiceValue)}
                        valueClassName="text-destructive"
                    />
                </div>
            </div>
        </section>
    );
}

interface SummaryRowProps {
    label: string;
    value: string;
    valueClassName?: string;
}

function SummaryRow({
    label,
    value,
    valueClassName = "text-foreground",
}: SummaryRowProps) {
    return (
        <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">
                {label}
            </span>

            <span className={`font-medium ${valueClassName}`}>
                {value}
            </span>
        </div>
    );
}