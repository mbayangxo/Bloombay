# /new-page

Creates a new BloomBay portal page with all brand tokens pre-applied.

## Usage
/new-page [page-name] [portal: member|admin|club|curator|partner]

## What I do
1. Create `app/components/portal/[name]-page.tsx` with:
   - `"use client"` directive
   - Correct design tokens: `PINK = "#FF1F7D"`, `PLUM = "#1A0A2E"`, `IVORY = "#fdf4ec"`, `INK = "#111111"`
   - Fonts: `var(--font-playfair)` italic headers, `var(--font-jost)` UI, `var(--font-caveat)` Yande/script
   - Grain texture SVG for paper surfaces
   - Time-of-day gradient if it's a top-level page
   - Yande voice block at the bottom of the first meaningful section
   - Mobile-first layout (max-width, safe-area-inset padding)

2. Create the route file `app/(member-portal)/member/[name]/page.tsx` that imports and renders the component

3. Confirm the component is in the portal list in bottom-nav.tsx if it needs a nav item

## Rules
- NEVER use Tailwind classes — all styling is inline `style={{}}` props
- NEVER use shadcn components
- Dark sections use PLUM (#1A0A2E), not generic black
- Yande signature is always `— Yande ✦` in Caveat font, PINK color
- Back arrow links back to the parent route
- Bottom padding of 96px for the bottom nav
