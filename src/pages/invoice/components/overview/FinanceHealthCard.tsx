import { Heading } from "@/common/components/Heading";
import { useMemo } from "react";

const CHART_WIDTH = 300;
const CHART_HEIGHT = 130;
const CHART_PADDING_TOP = 15;
const CHART_PADDING_BOTTOM = 8;

const DEFAULT_DATA = [
  { label: "1 Oct", value: 58 },
  { label: "4 Oct", value: 74 },
  { label: "7 Oct", value: 66 },
  { label: "10 Oct", value: 71 },
  { label: "13 Oct", value: 92 },
  { label: "16 Oct", value: 80 },
  { label: "18 Oct", value: 100 },
];

type DataPoint = { label: string; value: number };
type ChartPoint = { x: number; y: number; raw: DataPoint };

function buildSmoothPaths(
  points: ChartPoint[],
  height: number,
): { linePath: string; areaPath: string } {
  if (points.length === 0) return { linePath: "", areaPath: "" };

  if (points.length === 1) {
    const { x, y } = points[0];
    return {
      linePath: `M${x},${y} L${x},${y}`,
      areaPath: `M${x},${y} L${x},${height} L${x},${height} Z`,
    };
  }

  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  const last = points[points.length - 1];
  const first = points[0];
  const areaPath = `${d} L${last.x},${height} L${first.x},${height} Z`;

  return { linePath: d, areaPath };
}

interface FinanceHealthCardProps {
  title?: string;
  score?: number;
  maxScore?: number;
  status?: string;
  data?: DataPoint[];
}

export default function FinanceHealthCard({
  title = "Finance Health",
  score = 87,
  maxScore = 100,
  status = "Excellent",
  data = DEFAULT_DATA,
}: FinanceHealthCardProps) {
  const { linePath, areaPath, peak } = useMemo(() => {
    if (!data || data.length === 0) {
      return { linePath: "", areaPath: "", peak: null };
    }

    const values = data.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;

    const plotHeight = CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;
    const step = data.length > 1 ? CHART_WIDTH / (data.length - 1) : 0;

    const points: ChartPoint[] = data.map((d, i) => {
      const x = data.length > 1 ? i * step : CHART_WIDTH / 2;
      const normalized = (d.value - minValue) / valueRange;
      const y = CHART_PADDING_TOP + (1 - normalized) * plotHeight;
      return { x, y, raw: d };
    });

    const { linePath, areaPath } = buildSmoothPaths(points, CHART_HEIGHT);

    const peak = points.reduce((best, p) => (p.y <= best.y ? p : best), points[0]);

    return { linePath, areaPath, peak };
  }, [data]);

  return (
    <div className="w-full col-span-2 rounded-md border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <Heading title={title} className="text-md mb-0" />
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-bold leading-none text-emerald-600">{score}</span>
            <span className="text-base font-medium text-neutral-400">/{maxScore}</span>
          </div>

          <span className="mt-4 inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-[13px] font-medium text-emerald-600">
            {status}
          </span>
        </div>

        <div className="relative h-25 w-42.5 shrink-0 sm:w-47.4">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="fhc-area-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
            </defs>

            {areaPath && <path d={areaPath} fill="url(#fhc-area-fill)" stroke="none" />}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}

            {peak && (
              <circle cx={peak.x} cy={peak.y} r="4" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}