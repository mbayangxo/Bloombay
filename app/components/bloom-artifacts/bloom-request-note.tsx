import { artifactSizeClass, type ArtifactSize } from "@/lib/bloom-artifact-size";
import { ArtifactShell } from "./artifact-shell";

export type BloomRequestNoteProps = {
  overline?: string;
  headline: string;
  headlineAccent?: string;
  tagline?: string;
  body: string;
  receipt?: { label: string; value: string }[];
  handLabel?: string;
  href?: string;
  className?: string;
  size?: ArtifactSize;
  children?: React.ReactNode;
};

export function BloomRequestNote({
  overline = "Bloom request",
  headline,
  headlineAccent,
  tagline,
  body,
  receipt,
  handLabel,
  href,
  className = "",
  size = "standard",
  children,
}: BloomRequestNoteProps) {
  return (
    <ArtifactShell href={href} className={`bb-request-note ${artifactSizeClass(size)} ${className}`.trim()}>
      {handLabel ? <span className="bb-hand-label">{handLabel}</span> : null}
      <p className="bb-request-note__overline">{overline}</p>
      <h3 className="bb-request-note__headline">
        {headline}
        {headlineAccent ? (
          <>
            {" "}
            <span>{headlineAccent}</span>
          </>
        ) : null}
      </h3>
      {tagline ? <p className="bb-request-note__tagline">{tagline}</p> : null}
      <p className="bb-request-note__body">{body}</p>
      {receipt && receipt.length > 0 ? (
        <div className="bb-receipt">
          {receipt.map((row) => (
            <div key={row.label} className="bb-receipt__row">
              <span>{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}
          <div className="bb-receipt__barcode" aria-hidden />
        </div>
      ) : null}
      {children}
    </ArtifactShell>
  );
}
