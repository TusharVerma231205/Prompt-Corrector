import type { ScoreBreakdown } from "@/lib/analyzer";

interface BreakdownBarsProps {
  breakdown: ScoreBreakdown[];
}

export function BreakdownBars({ breakdown }: BreakdownBarsProps) {
  return (
    <div className="space-y-4">
      {breakdown.map((b) => {
        const pct = (b.score / b.max) * 100;
        const color =
          pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500";
        return (
          <div key={b.category}>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm font-semibold text-gray-700">
                {b.category}
              </span>
              <span className="text-xs tabular-nums text-gray-500">
                {b.score}/{b.max}
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">{b.note}</p>
          </div>
        );
      })}
    </div>
  );
}
