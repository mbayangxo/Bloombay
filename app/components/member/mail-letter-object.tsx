import { PhysicalObject } from "./physical-object";

export function MailLetterObject({
  src,
  from,
  subject,
  body,
  unread,
  href,
  index,
}: {
  src: string;
  from: string;
  subject: string;
  body?: string;
  unread?: boolean;
  href: string;
  index: number;
}) {
  return (
    <PhysicalObject
      src={src}
      alt={`Letter from ${from}`}
      href={href}
      pinned
      tilt={index % 2 === 0 ? -1.2 : 0.9}
    >
      {unread ? <span className="bb-mail-letter__stamp">New</span> : null}
      <p className="bb-mail-letter__from">{from}</p>
      <p className="bb-mail-letter__subject">{subject}</p>
      {body ? <p className="bb-mail-letter__body">{body.slice(0, 100)}{body.length > 100 ? "…" : ""}</p> : null}
    </PhysicalObject>
  );
}
