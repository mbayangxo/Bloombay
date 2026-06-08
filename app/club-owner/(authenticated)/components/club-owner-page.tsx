export function ClubOwnerPageTitle({
  title,
  sub,
  eyebrow,
}: {
  title: string;
  sub?: string;
  eyebrow?: string;
}) {
  return (
    <header className="co-page-head">
      {eyebrow ? <p className="co-page-head__eyebrow">{eyebrow}</p> : null}
      <h1 className="co-page-head__title">{title}</h1>
      {sub ? <p className="co-page-head__sub">{sub}</p> : null}
    </header>
  );
}
