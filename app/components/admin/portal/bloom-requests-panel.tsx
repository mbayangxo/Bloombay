import { BLOOM_REQUESTS } from "@/lib/city-launch";

export function BloomRequestsPanel() {
  return (
    <section className="fp-card">
      <h3 className="fp-card__title">Bloom requests</h3>
      <p className="fp-sub">What women are looking for — seeds new clubs & gatherings organically.</p>
      <ul className="fp-rank-list">
        {BLOOM_REQUESTS.map((r) => (
          <li key={r.id}>
            <span>
              <strong>{r.label}</strong> · {r.city}
            </span>
            <span>{r.count} women</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
