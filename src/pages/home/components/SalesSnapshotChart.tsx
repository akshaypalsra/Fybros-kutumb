import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCompactCurrency } from "@/utils/common.utils";

export interface SalesTrendPoint {
  month: string;
  value: number | null;
}

interface SalesSnapshotChartProps {
  points?: SalesTrendPoint[];
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: { value: number; payload: SalesTrendPoint }[];
  label?: string;
}

// Fixed colors — sidesteps hsl(var(--token)) format mismatches in dark mode.
// Swap back to CSS vars once you confirm your tokens are raw HSL triplets
// e.g. --muted-foreground: 215 20.2% 65.1%;
const CHART_COLOR = "#ef4444";
const AXIS_TEXT_COLOR = "#9ca3af"; // gray-400, visible on dark backgrounds
const GRID_COLOR = "#374151"; // gray-700

const ChartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length || payload[0].value == null) return null;

  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-[11px]" style={{ color: AXIS_TEXT_COLOR }}>
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground">
        {formatCompactCurrency(payload[0].value)}
      </p>
    </div>
  );
};

export const SalesSnapshotChart = ({ points = [] }: SalesSnapshotChartProps) => {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={points}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          className="mt-5"
        >
          <defs>
            <linearGradient id="salesBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLOR} stopOpacity={0.55} />
              <stop offset="100%" stopColor={CHART_COLOR} stopOpacity={0.15} />
            </linearGradient>
            <linearGradient id="salesAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLOR} stopOpacity={0.2} />
              <stop offset="100%" stopColor={CHART_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke={GRID_COLOR}
            opacity={0.5}
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: AXIS_TEXT_COLOR }}
            dy={8}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: AXIS_TEXT_COLOR }}
            tickFormatter={(value) => formatCompactCurrency(value)}
            width={60}
            tickMargin={4}
          />

          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: AXIS_TEXT_COLOR, opacity: 0.1 }}
          />

          <Bar
            dataKey="value"
            fill="url(#salesBarGradient)"
            radius={[6, 6, 0, 0]}
            barSize={20}
            isAnimationActive={false}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="none"
            fill="url(#salesAreaGradient)"
            connectNulls={false}
            isAnimationActive={false}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke={CHART_COLOR}
            strokeWidth={2.5}
            dot={{ r: 4, fill: CHART_COLOR, strokeWidth: 2, stroke: "white" }}
            activeDot={{ r: 5, fill: CHART_COLOR, strokeWidth: 2, stroke: "white" }}
            connectNulls={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};