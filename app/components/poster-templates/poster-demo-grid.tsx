"use client";

import { SAMPLE_POSTER_EVENTS } from "@/lib/poster-templates/sample-posters";
import { posterTemplateLabel, POSTER_TEMPLATE_TYPES, type PosterTemplateType } from "@/lib/poster-templates/types";
import { PosterRenderer } from "./poster-renderer";

export function PosterDemoGrid() {
  return (
    <div className="bb-poster-demo">
      <header className="bb-poster-demo__head">
        <p className="bb-poster-demo__eyebrow">BloomBay · Poster system</p>
        <h1 className="bb-poster-demo__title">Event poster templates</h1>
        <p className="bb-poster-demo__sub">
          Six designed objects — data-driven, not one-off cards. Photos are raster; seals and flourishes are SVG.
        </p>
        <ul className="bb-poster-demo__legend" aria-label="Template types">
          {POSTER_TEMPLATE_TYPES.map((t) => (
            <li key={t}>
              <span className={`bb-poster-demo__chip bb-poster-demo__chip--${t}`}>
                {posterTemplateLabel(t)}
              </span>
            </li>
          ))}
        </ul>
      </header>

      <div className="bb-poster-grid" role="list">
        {SAMPLE_POSTER_EVENTS.map((event) => (
          <div key={event.id} className="bb-poster-grid__cell" role="listitem">
            <p className="bb-poster-grid__label">{posterTemplateLabel(event.template)}</p>
            <PosterRenderer data={event} />
          </div>
        ))}
      </div>

      <p className="bb-poster-demo__note">
        Desktop: controlled grid widths. Mobile: swipe the row — each poster keeps its proportion.
      </p>
    </div>
  );
}

/** Map gathering kind / tags to a poster template (for production wiring). */
export function inferPosterTemplate(input: {
  kind?: string;
  category?: string;
  title?: string;
}): PosterTemplateType {
  const hay = `${input.kind ?? ""} ${input.category ?? ""} ${input.title ?? ""}`.toLowerCase();
  if (/dinner|supper|wine|table/.test(hay)) return "dinner";
  if (/club|house|member/.test(hay)) return "club";
  if (/party|launch|rooftop|night|celebration/.test(hay)) return "party";
  if (/museum|gallery|exhibit|culture|art/.test(hay)) return "museum";
  if (/walk|park|stroll|morning run/.test(hay)) return "walk";
  if (/wellness|yoga|pilates|matcha|restore|spa/.test(hay)) return "wellness";
  return "dinner";
}
