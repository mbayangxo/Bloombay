import type { GrowthTrend } from "@/lib/portal-dashboard-data";

export function TrendBadge({ trend }: { trend: GrowthTrend }) {
  if (trend === "steady") {
    return <span className="fp-trend fp-trend--steady" aria-label="Steady">→</span>;
  }
  if (trend === "down") {
    return <span className="fp-trend fp-trend--down" aria-label="Down">↓</span>;
  }
  return <span className="fp-trend fp-trend--up" aria-label="Up">↑</span>;
}
