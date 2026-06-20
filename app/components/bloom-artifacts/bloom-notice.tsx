import type { ReactNode } from "react";
import { ArtifactShell } from "./artifact-shell";

export type BloomNoticeProps = {
  eyebrow?: string;
  headline: string;
  body: string;
  footer?: ReactNode;
  official?: boolean;
  href?: string;
  className?: string;
};

export function BloomNotice({
  eyebrow,
  headline,
  body,
  footer,
  official,
  href,
  className = "",
}: BloomNoticeProps) {
  return (
    <ArtifactShell href={href} className={`bb-notice ${className}`.trim()}>
      {eyebrow ? <p className="bb-notice__eyebrow">{eyebrow}</p> : null}
      <h3 className="bb-notice__headline">{headline}</h3>
      <p className="bb-notice__body">{body}</p>
      {footer ? <p className="bb-notice__footer">{footer}</p> : null}
      {official ? (
        <span className="bb-wax-seal bb-wax-seal--sm bb-notice__seal" aria-hidden>
          BB
        </span>
      ) : null}
    </ArtifactShell>
  );
}
