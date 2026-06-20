"use client";

import { listMagazineEditions } from "@/lib/magazine-room/store";
import type { MagazineEdition } from "@/lib/magazine-room/types";

export function MagazineRack({ onOpen }: { onOpen: (edition: MagazineEdition) => void }) {
  const editions = listMagazineEditions();

  return (
    <div className="bb-mag-rack">
      <p className="bb-mag-rack__intro">
        BloomBay HQ — lifestyle, fashion, city. Pick a magazine, flip full screen, leave a thought on any page.
        <span className="bb-mag-rack__proto"> Editions on this device until HQ syncs.</span>
      </p>
      <ul className="bb-mag-rack__grid">
        {editions.map((ed) => (
          <li key={ed.id}>
            <button type="button" className="bb-mag-cover" onClick={() => onOpen(ed)}>
              {ed.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ed.coverImageUrl} alt="" className="bb-mag-cover__img" />
              ) : (
                <div className="bb-mag-cover__gradient" style={{ background: ed.coverGradient }} aria-hidden />
              )}
              <div className="bb-mag-cover__meta">
                <span className="bb-mag-cover__theme">{ed.theme}</span>
                <strong>{ed.title}</strong>
                <span>{ed.subtitle}</span>
                <span className="bb-mag-cover__cta">Open & flip →</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
