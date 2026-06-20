import Link from "next/link";
import type { ReactNode } from "react";
import type { WallNoteVariant } from "@/lib/bloom-artifact-types";

export type WallNoteProps = {
  topic: string;
  title: string;
  body: string;
  footer: string;
  variant?: WallNoteVariant;
  tilt?: number;
  href?: string;
  className?: string;
};

export function WallNote({
  topic,
  title,
  body,
  footer,
  variant = "ivory",
  tilt = 0,
  href,
  className = "",
}: WallNoteProps) {
  const noteClass = `bb-wall-note bb-wall-note--${variant} ${className}`.trim();
  const style = tilt ? { transform: `rotate(${tilt}deg)` } : undefined;
  const inner = (
    <>
      <p className="bb-wall-note__topic">{topic}</p>
      <h3 className="bb-wall-note__title">{title}</h3>
      <p className="bb-wall-note__body">{body}</p>
      <footer className="bb-wall-note__footer">{footer}</footer>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={noteClass} style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <article className={noteClass} style={style}>
      {inner}
    </article>
  );
}

export function WallBoard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bb-wall-grid bb-wall-board ${className}`.trim()}>{children}</div>;
}
