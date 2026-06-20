export function TopLocations({
  title,
  items,
}: {
  title: string;
  items: { name: string; count: number }[];
}) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <article className="bb-admin-card">
      <h2>{title}</h2>
      {items.length === 0 ? (
        <p className="bb-admin-empty">No location data yet.</p>
      ) : (
        <ul className="bb-admin-list">
          {items.map((item) => (
            <li key={item.name}>
              <strong>{item.name}</strong>
              <div className="bb-admin-bar" aria-hidden>
                <span style={{ width: `${(item.count / max) * 100}%` }} />
              </div>
              <span>{item.count}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
