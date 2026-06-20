import { artifactSizeClass, type ArtifactSize } from "@/lib/bloom-artifact-size";
import { ArtifactShell } from "./artifact-shell";

export type BloomPostcardProps = {
  caption: string;
  meta?: string;
  imageUrl?: string;
  imageStyle?: React.CSSProperties;
  href?: string;
  className?: string;
  size?: ArtifactSize;
};

/** Polaroid-style recap / memory. */
export function BloomPostcard({
  caption,
  meta,
  imageUrl,
  imageStyle,
  href,
  className = "",
  size = "compact",
}: BloomPostcardProps) {
  const visualStyle: React.CSSProperties = imageUrl
    ? { backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : imageStyle ?? { background: "var(--bb-barbie-soft)" };

  return (
    <ArtifactShell href={href} className={`bb-polaroid ${artifactSizeClass(size)} ${className}`.trim()}>
      <div className="bb-polaroid__img" style={visualStyle} role="img" aria-label={caption} />
      <p className="bb-polaroid__caption">{caption}</p>
      {meta ? (
        <p className="bb-polaroid__caption" style={{ fontSize: "0.72rem", opacity: 0.65, marginTop: "-0.25rem" }}>
          {meta}
        </p>
      ) : null}
    </ArtifactShell>
  );
}
