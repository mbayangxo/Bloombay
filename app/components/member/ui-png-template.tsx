import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

export type UiPngTemplateProps = {
  src: string;
  alt: string;
  variant?: "eats" | "poster" | "ticket" | "profile";
  href?: string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  children?: ReactNode;
};

export function UiPngTemplate({
  src,
  alt,
  variant = "poster",
  href,
  className = "",
  style,
  onClick,
  children,
}: UiPngTemplateProps) {
  const classes = `bb-ui-png bb-ui-png--${variant} ${className}`.trim();

  const inner = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="bb-ui-png__img" draggable={false} />
      {children ? <div className="bb-ui-png__overlays">{children}</div> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} style={style} onClick={onClick}>
        {inner}
      </Link>
    );
  }

  return (
    <div
      className={classes}
      style={style}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {inner}
    </div>
  );
}
