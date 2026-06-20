import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

export type PhysicalObjectProps = {
  src: string;
  alt: string;
  href?: string;
  className?: string;
  style?: CSSProperties;
  tilt?: number;
  pinned?: boolean;
  onClick?: () => void;
  children?: ReactNode;
};

export function PhysicalObject({
  src,
  alt,
  href,
  className = "",
  style,
  tilt = 0,
  pinned = false,
  onClick,
  children,
}: PhysicalObjectProps) {
  const classes = [
    "bb-physical-object",
    pinned ? "bb-physical-object--pinned" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle = {
    ...style,
    "--bb-tilt": `${tilt}deg`,
  } as CSSProperties;

  const inner = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="bb-physical-object__img" draggable={false} />
      {children ? <div className="bb-physical-object__overlays">{children}</div> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} style={mergedStyle} onClick={onClick}>
        {inner}
      </Link>
    );
  }

  return (
    <div
      className={classes}
      style={mergedStyle}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {inner}
    </div>
  );
}
