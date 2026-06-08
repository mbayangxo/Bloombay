import { splitTitleHighlight } from "@/lib/bloom-artifact-types";
import { artifactSizeClass, type ArtifactSize } from "@/lib/bloom-artifact-size";

export type BloomTicketProps = {
  title: string;
  titleHighlight?: string;
  admit?: string;
  brand?: string;
  meta: { label: string; value: string }[];
  code?: string;
  className?: string;
  horizontal?: boolean;
  size?: ArtifactSize;
};

export function BloomTicket({
  title,
  titleHighlight,
  admit = "ADMITS ONE · HER",
  brand = "BLOOMBAY",
  meta,
  code,
  className = "",
  horizontal,
  size = "standard",
}: BloomTicketProps) {
  const split = splitTitleHighlight(title);
  const lead = titleHighlight ? title.replace(new RegExp(`${titleHighlight}$`, "i"), "").trim() : split.lead;
  const hot = titleHighlight ?? split.highlight;

  return (
    <article
      className={`bb-ticket${horizontal ? " bb-ticket--horizontal" : ""} ${artifactSizeClass(size)} ${className}`.trim()}
    >
      <header className="bb-ticket__header">
        <span className="bb-ticket__admit">{admit}</span>
        <span className="bb-ticket__brand">{brand}</span>
      </header>
      <div className="bb-ticket__body">
        <h3 className="bb-ticket__title">
          {lead}
          {hot ? (
            <>
              {" "}
              <span>{hot}</span>
            </>
          ) : null}
        </h3>
        {meta.length > 0 ? (
          <div className="bb-ticket__meta-row">
            {meta.map((cell) => (
              <div key={cell.label} className="bb-ticket__meta-cell">
                <span className="bb-ticket__meta-label">{cell.label}</span>
                <span className="bb-ticket__meta-value">{cell.value}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="bb-ticket__perf" aria-hidden />
      <div className="bb-ticket__stub">
        <div className="bb-ticket__barcode" aria-hidden />
        {code ? <p className="bb-ticket__code">{code}</p> : null}
      </div>
    </article>
  );
}
