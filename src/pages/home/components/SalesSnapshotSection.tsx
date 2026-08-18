import { SalesSnapshotChart } from "./SalesSnapshotChart";
import { SalesSnapshotSummary } from "./SalesSnapshotSummary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";

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
}

export const SalesSnapshotSection = ({
  trend,
  range,
  onRangeChange,
}: SalesSnapshotSectionProps) => {
  return (
    <section>
      <h2 className="mb-3 text-md font-heading text-foreground">
        Sales Snapshot
      </h2>

      <div className="rounded-2xl border bg-card p-4">
        <div className="mb-1 flex items-start justify-between">
          <SalesSnapshotSummary
            bookedLastMonth={trend?.bookedLastMonth}
            growthPercent={trend?.growthPercent}
          />

          <Select value={range} onValueChange={(value) => onRangeChange(value as "MoM" | "QoQ")}>
            <SelectTrigger className="h-8 w-22.5 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MoM">MoM</SelectItem>
              <SelectItem value="QoQ">QoQ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <SalesSnapshotChart points={trend?.points} />
      </div>
    </section>
  );
};