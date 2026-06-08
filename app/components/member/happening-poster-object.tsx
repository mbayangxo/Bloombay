import type { CSSProperties } from "react";
import { posterMotionAccent } from "@/lib/happenings-motion";
import { PhysicalObject } from "./physical-object";

export type HappeningPosterObjectProps = {
  src: string;
  title: string;
  meta: string;
  eyebrow?: string;
  href?: string;
  className?: string;
  tilt?: number;
  pinned?: boolean;
  /** Stagger entry + pick one accent detail */
  index?: number;
};

export function HappeningPosterObject({
  src,
  title,
  meta,
  eyebrow,
  href,
  className = "",
  tilt,
  pinned = true,
  index = 0,
}: HappeningPosterObjectProps) {
  const accent = posterMotionAccent(index, meta);

  return (
    <PhysicalObject
      src={src}
      alt={title}
      href={href}
      pinned={pinned}
      tilt={tilt}
      className={`bb-ui-png--poster bb-hm-motion bb-hm-motion--enter ${className}`.trim()}
      style={{ "--bb-enter-index": index } as CSSProperties}
    >
      {eyebrow ? (
        <p className={`bb-ui-png__eyebrow${accent === "wiggle" ? " bb-hm-wiggle-once" : ""}`}>{eyebrow}</p>
      ) : null}
      <h3 className="bb-ui-png__title">{title}</h3>
      <p className={`bb-ui-png__meta${accent === "pulse" ? " bb-hm-pulse" : ""}`}>{meta}</p>
    </PhysicalObject>
  );
}
