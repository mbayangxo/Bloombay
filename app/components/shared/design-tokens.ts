// Shared design tokens — import these everywhere instead of inline hex strings.
// Changes here propagate to the whole app.

/** Page-level backgrounds — Barbie world / pretty in pink.
 *  Mirrors the canonical brand tokens in app/styles/bloom-brand.css:
 *    page  = soft blush wash   (white + baby pink read together)
 *    card  = crisp white       (floats on the blush, keeps it premium)
 *  Day:   blush page + white cards + hot/baby pink accents + black text
 *  Night: deep dark rose — easy on the eyes, same DNA  */
export const PAGE_BG      = "#FFF0F6";    // soft baby-pink blush — day pages
export const PAGE_CARD    = "#FFFFFF";    // white cards on the blush
export const PAGE_BG_DARK = "#1A0414";   // deep dark rose — night pages

/** Brand colours */
export const PINK        = "#FF1F7D";   // hot pink — energy / primary actions
export const BABY_PINK   = "#FF69B4";   // baby pink — soft accents
export const TEAL        = "#00C6A7";
export const GREEN       = "#16A34A";

/** Text */
export const INK         = "#111111";   // near-black — primary on white
export const INK_MUTED   = "rgba(17,17,17,0.48)";
export const INK_FAINT   = "rgba(17,17,17,0.22)";

/** Borders */
export const BORDER      = "rgba(17,17,17,0.09)";
export const BORDER_PINK = "rgba(255,31,125,0.16)";
