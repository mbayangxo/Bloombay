export function GrowthChip({
  value,
  period,
}: {
  value: number;
  period: string;
}) {
  return (
    <span className="fp-growth-chip">
      <span className="fp-growth-chip__plus">+{value.toLocaleString()}</span>
      <span className="fp-growth-chip__period">{period}</span>
    </span>
  );
}
