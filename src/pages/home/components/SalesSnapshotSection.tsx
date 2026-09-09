import { Heading } from "@/common/components/Heading";
import { SalesSnapshotChart, type SalesTrendPoint } from "./SalesSnapshotChart";
import { SalesSnapshotSummary } from "./SalesSnapshotSummary";
import { Dropdown } from "@/common/components/Dropdown";



export interface YearlyPeriodData {
  year: number;
  data: {
    amount: number;
    label: string;
    period: string;
  }[];
}

export interface SalesTrend {
  years: YearlyPeriodData[];
  bookedLastMonth: number;
  growthPercent: number;
}

interface SalesSnapshotSectionProps {
  trend?: SalesTrend;
  range: "MoM" | "QoQ";
  onRangeChange: (range: "MoM" | "QoQ") => void;
  isLoading?: boolean;
}

const RANGE_OPTIONS: { label: string; value: "MoM" | "QoQ" }[] = [
  { label: "MoM", value: "MoM" },
  { label: "QoQ", value: "QoQ" },
];

const toTrendPoints = (years: YearlyPeriodData[] = []): SalesTrendPoint[] => {
  if (years.length === 0) return [];

  const sorted = [...years].sort((a, b) => a.year - b.year);
  const [previous, current] = sorted.length === 2 ? sorted : [undefined, sorted[sorted.length - 1]];

  const count = current?.data.length ?? 0;

  return Array.from({ length: count }, (_, i) => {
    const currentPoint = current?.data[i];
    const previousPoint = previous?.data[i];

    // Use the human-readable label ("Jan 2025" / "Apr-Jun 2025") — formatAxisLabel in the chart strips the year
    const rawLabel = currentPoint?.label ?? previousPoint?.label ?? `${i + 1}`;

    return {
      month: rawLabel,
      previousYear: previousPoint?.amount ?? null,
      currentYear: currentPoint?.amount ?? null,
    };
  });
};

export const SalesSnapshotSection = ({
  trend,
  range,
  onRangeChange,
  isLoading,
}: SalesSnapshotSectionProps) => {
  const points = toTrendPoints(trend?.years);
  const [previousYear, currentYear] = (trend?.years ?? []).map((y) => y.year).sort((a, b) => a - b);

  return (
    <section>
      <Heading title={"Sales Snapshot"} className="text-md" />

      <div className="rounded-md border bg-card p-4">
        <div className="mb-1 flex items-start justify-between">
          <SalesSnapshotSummary
            bookedLastMonth={trend?.bookedLastMonth}
            growthPercent={trend?.growthPercent}
          />
          <Dropdown value={range} onValueChange={onRangeChange} options={RANGE_OPTIONS} />
        </div>

        {isLoading ? (
          "Loading"
        ) : (
          <div className={isLoading ? "opacity-50 transition-opacity" : "transition-opacity"}>
            <SalesSnapshotChart
              points={points}
              previousYearLabel={previousYear ? String(previousYear) : undefined}
              currentYearLabel={currentYear ? String(currentYear) : undefined}
            />
          </div>
        )}
      </div>
    </section>
  );
};