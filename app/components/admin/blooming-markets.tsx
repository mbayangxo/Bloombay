export function BloomingMarkets({
  markets,
}: {
  markets: { name: string; count: number; momentum: number }[];
}) {
  return (
    <article className="bb-admin-card bb-admin-card--accent">
      <h2>Blooming markets</h2>
      {markets.length === 0 ? (
        <p className="bb-admin-empty">Markets will appear as signups grow.</p>
      ) : (
        markets.map((m) => (
          <div key={m.name} className="bb-admin-market">
            <div>
              <strong>{m.name}</strong>
              <div style={{ color: "var(--bb-muted)", fontSize: "0.8rem" }}>
                {m.count} signup{m.count === 1 ? "" : "s"}
              </div>
            </div>
            <span className="bb-admin-momentum">{m.momentum}% bloom</span>
          </div>
        ))
      )}
    </article>
  );
}
