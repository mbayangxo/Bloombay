export function GeographyMap({
  pins,
}: {
  pins: { city: string; count: number; x: number; y: number }[];
}) {
  return (
    <div className="bb-admin-map" aria-label="Geography heat map">
      <svg viewBox="0 0 360 180" aria-hidden>
        <ellipse cx="180" cy="90" rx="170" ry="78" fill="currentColor" />
      </svg>
      {pins.map((pin) => (
        <span
          key={`${pin.city}-${pin.x}`}
          className="bb-admin-pin"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          data-count={`${pin.city} · ${pin.count}`}
          title={`${pin.city}: ${pin.count}`}
        />
      ))}
    </div>
  );
}
