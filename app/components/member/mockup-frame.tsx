"use client";

import type { CSSProperties, ReactNode } from "react";
import { POLAROID_PHOTO } from "@/lib/homepage-assets";

export function MockupFrame({
  src,
  className,
  rotate,
  children,
  underlay,
  photoUrl,
  photoHole = POLAROID_PHOTO,
  photoAlt = "",
}: {
  src: string;
  className?: string;
  rotate?: string;
  children?: ReactNode;
  underlay?: ReactNode;
  photoUrl?: string | null;
  photoHole?: { left: number; top: number; width: number; height: number };
  photoAlt?: string;
}) {
  const style: CSSProperties = {};
  if (rotate) style.transform = `rotate(${rotate})`;

  return (
    <div className={`bb-mockup-frame${className ? ` ${className}` : ""}`} style={style}>
      {underlay}
      {photoUrl ? (
        <div
          className="bb-mockup-frame__photo"
          style={{
            left: `${photoHole.left}%`,
            top: `${photoHole.top}%`,
            width: `${photoHole.width}%`,
            height: `${photoHole.height}%`,
            backgroundImage: `url(${photoUrl})`,
          }}
          role="img"
          aria-label={photoAlt}
        />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="bb-mockup-frame__img" draggable={false} />
      {children ? <div className="bb-mockup-frame__content">{children}</div> : null}
    </div>
  );
}
