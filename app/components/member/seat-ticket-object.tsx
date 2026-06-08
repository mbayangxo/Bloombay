import type { CSSProperties } from "react";
import { ticketMotionAccent } from "@/lib/happenings-motion";
import { PhysicalObject } from "./physical-object";

export type SeatTicketObjectProps = {
  src: string;
  title: string;
  meta: string;
  code?: string;
  href?: string;
  className?: string;
  tilt?: number;
  pinned?: boolean;
  index?: number;
};

export function SeatTicketObject({
  src,
  title,
  meta,
  code,
  href,
  className = "",
  tilt,
  pinned = false,
  index = 0,
}: SeatTicketObjectProps) {
  const accent = ticketMotionAccent(index, meta);

  return (
    <PhysicalObject
      src={src}
      alt={title}
      href={href}
      pinned={pinned}
      tilt={tilt}
      className={`bb-ui-png--ticket bb-hm-motion bb-hm-motion--enter ${className}`.trim()}
      style={{ "--bb-enter-index": index } as CSSProperties}
    >
      <h3 className="bb-ui-png__title">{title}</h3>
      <p className={`bb-ui-png__meta${accent === "pulse" ? " bb-hm-pulse" : ""}`}>{meta}</p>
      {code ? (
        <p className={`bb-ui-png__code${accent === "scan" ? " bb-hm-scan" : ""}`}>{code}</p>
      ) : null}
    </PhysicalObject>
  );
}
