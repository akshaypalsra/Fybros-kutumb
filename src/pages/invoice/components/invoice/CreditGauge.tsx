export const CreditGauge = ({ pct }: { pct: number }) => {
  const clamped = Math.max(0, Math.min(100, pct));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * clamped) / 100;

  return (
    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeOpacity={1}
          strokeWidth="8"
          className="text-green-500"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-white">
          {Math.round(clamped)}%
        </span>
        <span className="text-[11px] text-white">Utilized</span>
      </div>
    </div>
  );
};