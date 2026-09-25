import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCompactCurrency } from "@/utils/common.utils";

export interface SalesTrendPoint {
  month: string;
  previousYear: number | null;
  currentYear: number | null;
}

interface SalesSnapshotChartProps {
  points?: SalesTrendPoint[];
  previousYearLabel?: string;
  currentYearLabel?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: { value: number; name: string; dataKey: string }[];
  label?: string;
}

const PREVIOUS_YEAR_COLOR = "#fbb6b6";
const CURRENT_YEAR_COLOR = "#ef4444";
const AXIS_TEXT_COLOR = "#9ca3af";
const GRID_COLOR = "#e5e7eb";


const formatAxisLabel = (label: string) => {
  const alpha = label.replace(/[^a-zA-Z]/g, "");
  if (!alpha) return label.replace(/\s*\d{4}$/, "").trim();
  return alpha.slice(0, 1).toUpperCase() + alpha.slice(1, 3).toLowerCase();
};

const ChartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length || !label) return null;

  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-[11px]" style={{ color: AXIS_TEXT_COLOR }}>
        {label}
      </p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm font-heading text-foreground">
          {entry.name}: {formatCompactCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
};

export const SalesSnapshotChart = ({
  points = [],
  previousYearLabel = "2025",
  currentYearLabel = "2026",
}: SalesSnapshotChartProps) => {
  return (
    <div className="w-full">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={points}
            margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
            barGap={4}
            barCategoryGap="24%"
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={GRID_COLOR} />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: AXIS_TEXT_COLOR }}
              tickFormatter={formatAxisLabel}
              dy={8}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: AXIS_TEXT_COLOR }}
              tickFormatter={(value: number) => formatCompactCurrency(value)}
              width={56}
              tickMargin={4}
            />

            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: AXIS_TEXT_COLOR, opacity: 0.08 }}
            />

            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              iconType="square"
              iconSize={10}
              wrapperStyle={{ fontSize: 12, right: 0 }}
            />

            <Bar
              dataKey="previousYear"
              name={previousYearLabel}
              fill={PREVIOUS_YEAR_COLOR}
              radius={[3, 3, 0, 0]}
              barSize={18}
              isAnimationActive={false}
            />

            <Bar
              dataKey="currentYear"
              name={currentYearLabel}
              fill={CURRENT_YEAR_COLOR}
              radius={[3, 3, 0, 0]}
              barSize={18}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 text-end text-xs text-muted-foreground">
        *Current and Previous Financial Year
      </p>
    </div>
  );
};