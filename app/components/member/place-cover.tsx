import type { ReactNode } from "react";
import type { PlaceCoverTone } from "@/lib/place-cover-tone";

export type PlaceCoverProps = {
  /** Small tracked label — BloomBay place name */
  eyebrow: string;
  /** Main declaration */
  title: string;
  /** Cormorant italic line under the title */
  whisper?: string;
  /** Handwritten authored note (scrap / ribbon) */
  authored?: string;
  tone?: PlaceCoverTone;
  /** Bloom object, ticket, seal — sits in the cover corner */
  object?: ReactNode;
  className?: string;
};

export function PlaceCover({
  eyebrow,
  title,
  whisper,
  authored,
  tone = "poster",
  object,
  className = "",
}: PlaceCoverProps) {
  return (
    <header
      className={`bb-place-cover bb-place-cover--${tone} ${className}`.trim()}
      aria-label={eyebrow}
    >
      <div className="bb-place-cover__sheet">
        {object ? <div className="bb-place-cover__object">{object}</div> : null}
        <p className="bb-place-cover__eyebrow">{eyebrow}</p>
        <h1 className="bb-place-cover__title">{title}</h1>
        {whisper ? <p className="bb-place-cover__whisper">{whisper}</p> : null}
        {authored ? (
          <p className="bb-place-cover__authored" aria-label="BloomBay note">
            {authored}
          </p>
        ) : null}
      </div>
    </header>
  );
}
