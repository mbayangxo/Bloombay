/** Scrapbook PNG layers for member homepage collage */

export const SCRAPBOOK_BASE = "/assets/bloombay";

export const SCRAPBOOK = {
  heroPaper: `${SCRAPBOOK_BASE}/hero-paper-note.png`,
  polaroid: `${SCRAPBOOK_BASE}/polaroid-frame.png`,
  calendarStrip: `${SCRAPBOOK_BASE}/calendar-strip.png`,
  invitationEnvelope: `${SCRAPBOOK_BASE}/invitation-envelope.png`,
  pinkSticky: `${SCRAPBOOK_BASE}/pink-sticky-note.png`,
  tapeCream1: `${SCRAPBOOK_BASE}/masking-tape-cream-1.png`,
  tapeCream2: `${SCRAPBOOK_BASE}/masking-tape-cream-2.png`,
  tapeGrid1: `${SCRAPBOOK_BASE}/masking-tape-grid-1.png`,
  tapeGrid2: `${SCRAPBOOK_BASE}/masking-tape-grid-2.png`,
  tapePink: `${SCRAPBOOK_BASE}/masking-tape-pink.png`,
  flower: `${SCRAPBOOK_BASE}/flower-sticker.png`,
} as const;

/** Polaroid photo hole — % of frame (from manifest) */
export const POLAROID_HOLE = {
  left: (44 / 380) * 100,
  top: (44 / 460) * 100,
  width: (292 / 380) * 100,
  height: (292 / 460) * 100,
};
