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

const ChartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length || payload[0].value == null) return null;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-[11px] text-muted-foreground">{label}</p>
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
        >
          <defs>
            <linearGradient id="salesBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0.08} />
            </linearGradient>
            <linearGradient id="salesAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.15} />
              <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            dy={8}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(value) => formatCompactCurrency(value)}
            width={36}
          />

          <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />

          <Bar
            dataKey="value"
            fill="url(#salesBarGradient)"
            radius={[6, 6, 0, 0]}
            barSize={20}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="none"
            fill="url(#salesAreaGradient)"
            connectNulls={false}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--destructive))"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "hsl(var(--destructive))", strokeWidth: 2, stroke: "white" }}
            activeDot={{ r: 5, fill: "hsl(var(--destructive))", strokeWidth: 2, stroke: "white" }}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};