import Link from "next/link";

export function PortalSignal({
  href,
  kicker,
  title,
  count,
  detail,
}: {
  href: string;
  kicker: string;
  title: string;
  count: number;
  detail?: string;
}) {
  return (
    <Link href={href} className="bb-portal-signal">
      <span className="bb-portal-signal__kicker">{kicker}</span>
      <span className="bb-portal-signal__count">{count.toLocaleString()}</span>
      <span className="bb-portal-signal__title">{title}</span>
      {detail ? <span className="bb-portal-signal__detail">{detail}</span> : null}
    </Link>
  );
}
