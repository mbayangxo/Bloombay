import Link from "next/link";
import type { PosterTemplateType } from "@/lib/poster-templates/types";

type PosterFrameProps = {
  template: PosterTemplateType;
  href?: string;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties & { "--bb-pt-accent"?: string };
};

export function PosterFrame({ template, href, className = "", children, style }: PosterFrameProps) {
  const classes = `bb-pt bb-pt--${template} ${className}`.trim();
  const inner = (
    <article className={classes} style={style}>
      <div className="bb-pt__paper" aria-hidden />
      {children}
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="bb-pt__link">
        {inner}
      </Link>
    );
  }

  return inner;
}
