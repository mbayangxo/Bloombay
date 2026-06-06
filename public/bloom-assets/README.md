# BloomBay assets — what to add (simple guide)

Your **reference photos** in `app/member/bloombaymemberui/` are the design blueprint. The app uses copies in `public/bloom-assets/refs/` so pages can show real photos.

## What helps most (in order)

### 1. Photos (JPG or PNG) — **most important**
Real images for heroes and cards: rooftops, dinners, clubs, city skylines, girls at events.

| Use | Suggested name | Example in app |
|-----|----------------|----------------|
| Home hero | `home-hero.jpg` | `/bloom-assets/refs/home-hero.jpg` |
| Tonight / bulletin | `tonight.jpg` | `/bloom-assets/refs/tonight.jpg` |
| Living room / lounge | `lounge.jpg` | `/bloom-assets/refs/lounge.jpg` |
| Clubs / zones | `zones.jpg` | `/bloom-assets/refs/zones.jpg` |
| Per club (optional) | `club-morning-run.jpg` | club cards |

**You do not need to code.** Drop files here and tell us the filenames — we wire them in.

### 2. Logo (SVG) — **you already have these**
- `public/logosbloombay/Vector.svg` and `Vector-1.svg` — header & nav

### 3. BloomBay object icons (`bloombay objects/`) — **wired in the app**
Use these SVGs as-is (no redraw in code). Crests, join flow, bouquet, and symbol pickers load from:

| File | Used for |
|------|----------|
| `bloom-crest.svg` | Crest shield template |
| `bloom-bouquet.svg` | Bouquet page, crest “Bloom” symbol |
| `bloom-pin.svg` | Crest “Spark” symbol |
| `bloom-key.svg` | Crest “Compass” / travel |
| `bloom-table.svg` | Crest “Plate” / food |
| `bloom-ticket.svg` | Crest “Palette” / arts |
| `bloom-door.svg` | Crest “Founders” |
| `bloom-postcard.svg` | Crest “Book” |
| `bloom-request.svg` | Club join / apply |
| `IMG_2710.svg` … | Crest run / moon / leaf symbols |

Brand colors in CSS: hot pink `#e8007a`, ink `#1a0a2e` (see `app/styles/bloom-brand.css`).

### 4. Decorative SVGs (optional, nice-to-have)
Small shapes the UI can repeat: torn paper edge, tape strip, pushpin, flower doodle, ticket stub.

| File idea | Purpose |
|-----------|---------|
| `torn-paper.svg` | Sticky-note / bulletin cards |
| `tape.svg` | “Taped” polaroid corners |
| `pushpin.svg` | Bulletin board pins |
| `flower-accent.svg` | Scrapbook decoration |

We can also draw many of these in CSS; SVGs just make them match your mockups exactly.

### 4. What you do **not** need to send
- Full page layouts as SVG (your JPG mockups are enough)
- Custom fonts (we use Unbounded + Outfit unless you buy/license others)

## Folder structure

```
public/bloom-assets/
  refs/           ← hero & mood photos (from your mockups)
  decor/          ← optional SVG decorations
  clubs/          ← optional per-club cover photos
```

## How to replace a background

1. Add your image to `public/bloom-assets/refs/`
2. Keep the same filename **or** tell us the new name
3. Refresh the browser

Reference mockups stay in `app/member/bloombaymemberui/` for designers; the live app reads from `public/bloom-assets/`.
