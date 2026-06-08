import type { CSSProperties, ReactNode } from "react";

export function ScrapbookLayer({
  src,
  alt = "",
  className,
  rotate,
  zIndex,
  children,
  underlay,
  style,
}: {
  src: string;
  alt?: string;
  className?: string;
  rotate?: string;
  zIndex?: number;
  children?: ReactNode;
  /** Renders behind the frame image (e.g. polaroid photo) */
  underlay?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`bb-home-layer${className ? ` ${className}` : ""}`}
      style={{
        ...style,
        ...(rotate ? { transform: `rotate(${rotate})` } : {}),
        ...(zIndex != null ? { zIndex } : {}),
      }}
    >
      {underlay}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="bb-home-layer__img" draggable={false} />
      {children ? <div className="bb-home-layer__content">{children}</div> : null}
    </div>
  );
}
