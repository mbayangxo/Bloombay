import Link from "next/link";
import type { ReactNode } from "react";

export function BbEmptyState({
  title,
  body,
  actionLabel,
  actionHref,
  icon,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="bb-empty">
      {icon ? <div className="bb-empty__icon">{icon}</div> : null}
      <h3 className="bb-empty__title">{title}</h3>
      <p className="bb-empty__body">{body}</p>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="bb-empty__action">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
