import { Heading } from "@/common/components/Heading";
import { SalesSnapshotChart } from "./SalesSnapshotChart";
import { SalesSnapshotSummary } from "./SalesSnapshotSummary";
import { Dropdown } from "@/common/components/Dropdown";

interface SalesTrend {
  points: {
    month: string;
    value: number;
  }[];
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

export const SalesSnapshotSection = ({
  trend,
  range,
  onRangeChange,
  isLoading,
}: SalesSnapshotSectionProps) => {
  return (
    <section>
      <Heading title={'Sales Snapshot'} className="text-md"/>

        <div className="rounded-md border bg-card p-4">
          <div className="mb-1 flex items-start justify-between">
            <SalesSnapshotSummary
              bookedLastMonth={trend?.bookedLastMonth}
              growthPercent={trend?.growthPercent}
            />
            <Dropdown value={range} onValueChange={onRangeChange} options={RANGE_OPTIONS} />
          </div>

          {isLoading ? 'Loading' : <div className={isLoading ? "opacity-50 transition-opacity" : "transition-opacity"}>
            <SalesSnapshotChart points={trend?.points} />
          </div>}
        </div>
    </section>
  );
};