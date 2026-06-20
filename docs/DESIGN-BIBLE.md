# BloomBay Design Bible v1

> *"Tangible luxury. Editorial voice. Real women."*

**Status:** Living document.
**Last updated:** June 2026
**Codebase:** `girlfrnds-prototype` — Next.js 16, Tailwind 4, Supabase

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Colors](#2-colors)
3. [Typography](#3-typography)
4. [Spacing & Scale](#4-spacing--scale)
5. [Motion & Easing](#5-motion--easing)
6. [Shadows & Depth](#6-shadows--depth)
7. [Navigation](#7-navigation)
8. [Artifact System](#8-artifact-system)
9. [Club Poster System](#9-club-poster-system)
10. [Invitation System](#10-invitation-system)
11. [Event Poster System](#11-event-poster-system)
12. [Notice System](#12-notice-system)
13. [Ticket System](#13-ticket-system)
14. [Bloom Request System](#14-bloom-request-system)
15. [Component Reference](#15-component-reference)
16. [Portal Design Language](#16-portal-design-language)
17. [Flow Design](#17-flow-design)
18. [Do & Do Not](#18-do--do-not)
19. [CSS File Map](#19-css-file-map)
20. [Asset Inventory](#20-asset-inventory)
21. [Decision Log](#21-decision-log)

---

## 1. Design Philosophy

### The Five Principles

**1. Artifacts, not cards**
A gathering invitation is not a card with a title and a button. It is an envelope with a wax seal. A reserved seat is not a confirmation screen. It is a ticket stub with perforations and a barcode. Every content type should feel like a physical object you could hold.

Ask of every component: *what is the real-world equivalent?* Then make the digital feel like that.

**2. Editorial, not app**
BloomBay reads like the intersection of a members club brochure, a city nightlife poster, and a cultural arts magazine. The typography declares (Barlow Condensed). The copy whispers (Cormorant Garamond italic). The UI gets out of the way (DM Sans).

Never like a startup dashboard. Never like a social media app.

**3. Restraint over decoration**
The hot pink on velvet black is bold enough. The palette does not need help. White space is a design choice. An empty moment between elements is better than a filler element.

**4. Warmth through specificity**
Generic design feels cold. Specific design feels warm. "Two women in Chelsea are having dinner Thursday" is warmer than "Events near you." Specificity in copy, specificity in design — exact dimensions, exact colors, exact language.

**5. Mobile-first, IRL-focused**
This product exists to pull women into real rooms. The screen is the invitation — not the experience. Design for the hand, not the desk. Build for the walk across the room, the scan at the door, the polaroid taken at the table.

---

## 2. Colors

### Token File: `app/styles/bloom-brand.css`

This is the single source of truth. Never hardcode hex values in components. Always use CSS variables.

### Core Palette

| Token | Hex | Name | Primary use |
|---|---|---|---|
| `--bb-hot` | `#FF0055` | BloomBay Hot Pink | Primary CTAs, active states, emphasis |
| `--bb-hot-deep` | `#CC0044` | Deep Hot Pink | Hover, pressed, dark accents |
| `--bb-barbie` | `#FFB7CE` | Barbie Pink | Secondary accents, soft icons, nav resting |
| `--bb-barbie-soft` | `#FFE4EC` | Barbie Blush | Panel backgrounds, soft cards, pill backgrounds |
| `--bb-velvet` | `#1A0514` | Velvet Black | Primary text, dark surfaces, sidebar |
| `--bb-ink` | `#1A0514` | Ink (alias) | Use interchangeably with velvet |
| `--bb-ivory` | `#FDF4EC` | Warm Ivory | Primary page background |
| `--bb-ivory-deep` | `#F7EDE0` | Deep Ivory | Cards on ivory, slightly darker surfaces |
| `--bb-white` | `#FFFFFF` | White | Card backgrounds, form fields |
| `--bb-muted` | `rgba(26,5,20,0.5)` | Muted Velvet | Secondary text, captions, placeholders |
| `--bb-line` | `rgba(255,0,85,0.2)` | Pink Line | Hot pink dividers, subtle emphasis borders |
| `--bb-line-soft` | `rgba(26,5,20,0.08)` | Soft Line | Neutral dividers, form borders |
| `--rose-gold` | `#C9A27A` | Rose Gold | Wax seal shimmer, legacy accent |

### Semantic Pairs

**Standard CTA:** `--bb-hot` background + `--bb-white` text
**Standard text:** `--bb-velvet` on `--bb-ivory` or `--bb-white`
**Secondary text:** `--bb-muted` on any light surface
**Dividers on light:** `--bb-line-soft`
**Dividers on light (emphasis):** `--bb-line`

### Color Pairing Rules

❌ Hot pink on hot pink — never
❌ White text on barbie pink — fails WCAG contrast
❌ Ivory text on white — too low contrast
❌ Hardcoded hex in components — always use tokens

✅ Hot pink on white or ivory — correct
✅ Hot pink on velvet — correct
✅ White on velvet — correct
✅ Muted velvet on ivory — correct

### Wax Seal — The Exception

The wax seal uses a specific dark rose gradient — not `--bb-hot`. This distinguishes it as a material object (wax), not a UI element.

```css
background: radial-gradient(circle at 35% 35%, #c9527a, #8b1a3a);
box-shadow: 0 2px 8px rgba(139, 26, 58, 0.5), inset 0 1px 2px rgba(255,255,255,0.2);
```

### Night Theme

Active after 8pm in the member portal via `DayNightTheme` component.

```css
.mp-app[data-mp-theme="night"] {
  --mp-barbie-soft: #0f0a0c;
  --mp-white: #1a1216;
  --mp-ink: #fff5f8;
  --mp-muted: rgba(255, 214, 228, 0.55);
  --mp-line: rgba(255, 0, 85, 0.35);
}
```

Currently member portal only. Should extend to all portals in v2.

---

## 3. Typography

### The System

Three fonts. Every text element belongs to exactly one.

```
DISPLAY ← Barlow Condensed   — declarations, event titles, stats
ACCENT  ← Cormorant Garamond — emotional phrases, whispers
UI      ← DM Sans            — navigation, forms, labels, metadata
```

Loaded via `next/font/google` in `app/layout.tsx`:

```typescript
const barlowCondensed = Barlow_Condensed({ variable: "--font-display", ... });
const cormorantGaramond = Cormorant_Garamond({ variable: "--font-accent", ... });
const dmSans = DM_Sans({ variable: "--font-ui", ... });
```

CSS variables:
```css
--font-display: 'Barlow Condensed', 'Arial Narrow', sans-serif;
--font-accent:  'Cormorant Garamond', 'Georgia', serif;
--font-ui:      'DM Sans', system-ui, sans-serif;
```

**Deprecated — do not use:** `--font-unbounded`, `--font-outfit`, `--font-jost`, `--font-script`

---

### Display — Barlow Condensed

Bold, tall, compressed. Declarations. The voice that fills a room.

**Always uppercase. Always tight line-height.**

```css
.bb-display-xl { font-size: clamp(3.5rem, 10vw, 7rem);  font-weight: 900; line-height: 0.92; letter-spacing: -0.01em; text-transform: uppercase; }
.bb-display-lg { font-size: clamp(2.5rem, 7vw, 5rem);   font-weight: 800; line-height: 0.95; letter-spacing: -0.01em; text-transform: uppercase; }
.bb-display-md { font-size: clamp(1.8rem, 5vw, 3.2rem); font-weight: 700; line-height: 1.0;  text-transform: uppercase; }
```

Color variants: `.bb-display--pink` (--bb-hot) · `.bb-display--white` · `.bb-display--ivory`

**Use for:** Event name on ticket. Page declaration (HAPPENINGS, THE ROOM, CLUBS). KPI numbers in portals. Stat callouts. Seat number. Table assignment.

**Never for:** Body text. Button labels. Navigation. Any text under 1.2rem.

---

### Accent — Cormorant Garamond Italic

Elegant, emotional, restrained. Whispered phrases. The voice that leans in.

**Always italic. Use sparingly — maximum 2 lines at a time.**

```css
.bb-accent-lg { font-size: clamp(1.6rem, 4vw, 2.8rem); font-style: italic; font-weight: 400; line-height: 1.2; }
.bb-accent-md { font-size: clamp(1.2rem, 3vw, 1.8rem); font-style: italic; font-weight: 400; line-height: 1.3; }
.bb-accent-sm { font-size: 1.05rem;                      font-style: italic; font-weight: 400; line-height: 1.4; }
```

Color variants: `.bb-accent--pink` · `.bb-accent--muted` · `.bb-accent--white`

**Use for:** Paired subline below a Display headline. Club taglines. Yande voice. Bloom Request letter body. Wall note body. Emotional onboarding moments. Quote callouts.

**Never for:** Labels, metadata, navigation, more than a short phrase.

---

### UI — DM Sans

Clean, readable. Everything functional.

```css
.bb-ui-base   { font-size: 0.9375rem; font-weight: 400; line-height: 1.55; }
.bb-ui-strong { font-size: 0.9375rem; font-weight: 600; line-height: 1.4;  }
.bb-eyebrow   { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--bb-hot); }
.bb-eyebrow--muted { color: var(--bb-muted); }
.bb-caption   { font-size: 0.8125rem; font-weight: 400; color: var(--bb-muted); line-height: 1.4; }
.bb-tag       { font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
```

**Eyebrow** (`.bb-eyebrow`) — the most-used element in the system. Always:
- 11px
- Weight 700
- All uppercase
- Tracked 0.14em
- Hot pink
- Above (never below) a headline
- One line only

**Use for:** All navigation. All buttons. All form fields. All metadata (date, time, location). All tags, pills, and chips. Section eyebrows.

---

### Correct Typography Hierarchy

```
.bb-eyebrow          ← SECTION LABEL (UI, caps, hot pink)
.bb-display-lg       ← DECLARATION (Barlow, all-caps)
.bb-accent-sm        ← emotional subline (Cormorant italic)
.bb-ui-base          ← body copy
.bb-caption          ← date · time · location · count
```

Real example — Event detail page:

```
HAPPENING · DINNER PARTY          ← .bb-eyebrow
LATE NIGHTS,                      ← .bb-display-lg
GIRLS, & GOOD WINE
Good food. Real conversation.     ← .bb-accent-sm
Sat, May 24 · 8:00PM · SoHo      ← .bb-caption
```

---

## 4. Spacing & Scale

**Base unit: 4px.** Everything is a multiple of 4px. No odd values.

```css
--space-1:  0.25rem;  /*  4px */
--space-2:  0.5rem;   /*  8px */
--space-3:  0.75rem;  /* 12px */
--space-4:  1rem;     /* 16px */
--space-5:  1.25rem;  /* 20px */
--space-6:  1.5rem;   /* 24px */
--space-8:  2rem;     /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Page Horizontal Padding

| Breakpoint | Padding |
|---|---|
| Mobile (< 768px) | `1.25rem` (20px) |
| Tablet (768–899px) | `1.5rem` |
| Desktop (900px+) | `2.5rem` (40px) |

### Internal Spacing Rules

- Eyebrow → headline: `var(--space-2)`
- Headline → subline: `var(--space-2)`
- Subline → body: `var(--space-4)`
- Section → section: `var(--space-8)` minimum
- Card inner padding: `var(--space-4) var(--space-5)` standard, `var(--space-5) var(--space-6)` artifact
- Between cards in a grid: `var(--space-4)` standard, `var(--space-6)` artifact wall

---

## 5. Motion & Easing

### The Luxury Ease

One easing function for all transitions:

```css
--ease-luxury: cubic-bezier(0.22, 1, 0.36, 1);
```

Fast out, slow in. Premium, confident. Like a heavy door opening.

### Duration Scale

```css
--duration-fast:   150ms;   /* Hover, focus, active — instant feedback */
--duration-smooth: 300ms;   /* Cards, tabs, dropdowns — standard transitions */
--duration-luxe:   600ms;   /* Cinematic moments — envelope flap, page entrances */
```

Never use a value between these three. Pick the nearest.

### Named Animation Keyframes

All keyframes live in `app/styles/luxury-motion.css`.

| Name | Duration | Used for |
|---|---|---|
| `invite-fade-up` | 1s ease-luxury | Landing page hero elements entering |
| `invite-flap-open` | 0.75s ease-luxury | Envelope flap opening |
| `luxury-petal-drift` | 18–22s ease-in-out infinite | Background petal float |
| `bloom-float` | 9s ease-in-out infinite | Idle object float (between interactions) |
| `bb-stamp-press` | 0.45s ease-luxury | Ticket stamp press |
| `mp-seasonal-float` | 6s ease-in-out infinite | Seasonal decor float |
| `bb-pin-pulse` | 2.8s ease-in-out infinite | Map pin pulse |
| `fp-shimmer` | 3.5s ease-in-out infinite | Founder portal KPI shimmer |

### Reduced Motion

Mandatory. All animations inside `@media (prefers-reduced-motion: reduce)` blocks must disable gracefully. Content must never be hidden only behind an animation.

```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition-duration: 0ms !important; }
}
```

---

## 6. Shadows & Depth

Four levels. Use the minimum needed to create separation.

```css
--shadow-soft:  0 2px 12px rgba(26, 5, 20, 0.07);   /* Barely lifted */
--shadow-card:  0 4px 24px rgba(26, 5, 20, 0.10);   /* Standard cards */
--shadow-float: 0 12px 40px rgba(26, 5, 20, 0.14);  /* Artifacts, floating panels */
--shadow-pink:  0 4px 20px rgba(255, 0, 85, 0.22);  /* CTA buttons, active elements */
```

**`--shadow-soft`:** Input fields, tags. Sitting on the surface.
**`--shadow-card`:** Any card component. Default choice.
**`--shadow-float`:** Tickets, envelopes, polaroids. Lifted off the surface.
**`--shadow-pink`:** Hot pink buttons only. The pink glow is earned.

---

## 7. Navigation

### Member App

**Desktop (≥ 768px): Left Sidebar**
- Width: 220px
- Background: `linear-gradient(180deg, #0d0010, #1A0514)`
- Border-right: `1px solid rgba(255, 0, 85, 0.18)`
- Brand mark at top
- 7 nav items in order: Home, Explore, Clubs, Happenings, Connect, Lounge, The Room
- Settings at bottom

Active link: `linear-gradient(135deg, --bb-hot, #ff69b4)`, white text, weight 600
Resting link: `rgba(255,245,248,0.75)`, weight 500
Hover: `rgba(255,0,85,0.12)` background, white text

**Mobile (< 768px): Bottom Nav**
- Sidebar hidden (`display: none`)
- Fixed bottom bar, 5 primary tabs
- Background: white, border-top `1px solid rgba(26,5,20,0.08)`
- Active tab: hot pink text + icon in pink pill (`36px × 28px`, `border-radius: 20px`)
- Resting tab: `--bb-muted` text, bare icon

**5 Bottom Nav Tabs:**
1. Home — `/member/home`
2. Explore — `/member/explore`
3. Clubs — `/member/clubs`
4. Happenings — `/member/happenings`
5. The Room — `/member/room`

**Bottom padding:** All page content must have `padding-bottom: calc(72px + env(safe-area-inset-bottom))` on mobile.

### Portal Navigation

Each portal has a sidebar with personality:

| Portal | Sidebar style | Key groupings |
|---|---|---|
| Founder / Admin | White sidebar, rose gold accents | Community, Operations, Analytics, System |
| Club Owner | Hot pink header bar, hub grid (no sidebar) | 35+ cards in 4-column grid |
| Partner | White sidebar, clean list | Bookings, Events, Members, Analytics, Promotions, Messages, Payouts, Settings |
| Curator | Minimal, DM Sans | Dashboard, Gatherings, Women, Pay |

### Navigation Rules

1. Back links go to the immediately previous level. Not to home.
2. Active state is unambiguous — hot pink, bold, never subtle.
3. Portal isolation is middleware-enforced. Never build UI that crosses portal boundaries.
4. Cross-portal links appear only on login pages — never in the live app.

---

## 8. Artifact System

The emotional core. Every content type maps to a physical object.

### The Canonical Map

| Content | Artifact | CSS class | When |
|---|---|---|---|
| Gathering invitation | Envelope + wax seal | `.bb-envelope` + `.bb-wax-seal` | Happenings / Invitations tab |
| Reserved seat | Perforated ticket + barcode | `.bb-ticket` | Seat detail, confirmed RSVP |
| Connection request | Folded letter + receipt | `.bb-request-note` + `.bb-receipt` | Bloom Request received |
| Memory / moment | Polaroid photo | `.bb-polaroid` | Lounge Memories, home recap |
| Room wall post | Pinned note card | `.bb-wall-note` | The Wall, Bulletin |
| Club profile card | Photo editorial poster | `.bb-club-poster` | Club browse, featured |
| Quote / Yande says | Torn paper note | `.bb-torn-note` | Yande nudges, onboarding hints |
| Announcement | Formal notice | `.bb-notice` | Community updates, rules |
| Home navigation | Bordered pillar card | `.bb-pillar` | Member home 4-grid |

**Rule:** If an artifact exists for the content type, use it. A generic card where an artifact should be is a design failure.

### Artifact Component File

All CSS: `app/styles/bb-artifacts.css`

---

## 9. Club Poster System

Clubs are worlds. Club cards communicate aesthetic identity first, data second.

### Poster Anatomy

```
[Photo — full bleed, aspect-ratio 3:4]
[Dark gradient overlay — transparent top → 85% dark bottom]
  [Category — .bb-eyebrow, --bb-barbie color]
  [Club Name — .bb-display-md, uppercase, white]
  [Tagline — .bb-accent-sm italic, white 80%]
  [Members · Active now — .bb-caption, white 60%]
[Join button — top-right, hot pink pill]
```

CSS class: `.bb-club-poster`

```css
.bb-club-poster {
  aspect-ratio: 3/4;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}
.bb-club-poster:hover { transform: translateY(-4px); box-shadow: var(--shadow-float); }
```

### Club Identity System

Every club has three identity layers:
1. **Crest** — auto-generated SVG from host symbol + rose motif
2. **Poster** — full-bleed photo card for browse/discovery
3. **Landing** — editorial full-page experience (hero + crest + credibility + photos)

### Club Health Indicator

A club's health score (0–100) is visible on the landing page and in the Clubhouse portal. It is a composite of trust, activity, and trend signals from `lib/club-signals.ts`.

**Below threshold:** "resting" badge on club poster. Host can revive by scheduling a gathering.

---

## 10. Invitation System

A BloomBay gathering invitation is always an envelope. Not a card. Not a notification.

### Envelope Component

`.bb-envelope` structure:

```
[.bb-envelope]
  [.bb-envelope__flap]          ← barbie pink triangle (clip-path: polygon)
  [.bb-wax-seal]                ← dark rose radial gradient, "BB" label
  [.bb-envelope__body]
    [.bb-envelope__invite-line] ← "You're invited" — Accent italic, muted
    [.bb-envelope__event-name]  ← Event name — Display md, velvet
    [.bb-envelope__meta]        ← Date · Host — UI caption
  [.bb-envelope__date-badge]    ← "MAY 18" — hot pink pill, top right
```

### Wax Seal Sizes

`.bb-wax-seal` (48px default) · `.bb-wax-seal--lg` (64px) · `.bb-wax-seal--sm` (36px)

All seals show "BB" in Display, white, weight 700.

### Stacked Invitations

Multiple invitations use `.bb-envelope-stack`:
- Card 1: z-index 3, full opacity
- Card 2: z-index 2, offset down-right 8px, opacity 0.85
- Card 3: z-index 1, offset 16px, opacity 0.70

### The Luxury Landing Stage

The full-screen landing page uses an elevated version of the envelope metaphor:
- SVG envelope illustration (`/public/images/bloombay-envelope-hero.svg`)
- Animated flap opening on click (0.75s ease-luxury)
- Letter card slides up from envelope interior
- Velvet rose gradient background with radial pink glows
- Petal drift ambient animation (18–22s)
- "Open your invitation" physical tag with punch hole

Source: `app/components/bloom-suite/luxury-invitation-stage.tsx`
CSS: `app/styles/invite-luxury.css`

---

## 11. Event Poster System

For happenings, parties, pop-ups. Distinct from club posters — event-specific.

### Poster Header Pattern

```
[HAPPENING TYPE · VENUE TYPE]    ← .bb-eyebrow
[EVENT TITLE LINE 1]             ← .bb-display-xl, velvet or white
[EVENT TITLE LINE 2]
[Tags: Category · Area · Women Only · Age]  ← pill row, .bb-tag
```

The most important word in the event title gets hot pink:
- `SATURDAY IN` (velvet) + `SOHO` (hot pink)
- `LATE NIGHTS, GIRLS, &` (velvet) + `GOOD WINE` (hot pink)

### The "Admit One, Her" Convention

All BloomBay event pages use gender-specific admission copy:
- `ADMIT ONE · HER` — standard gathering (default)
- `ADMIT ONE · ALL MEMBERS` — Blueday events
- `BLOOMBAY HQ` — brand-hosted events

This language appears at: top of event detail pages, ticket header, envelope flap text.

---

## 12. Notice System

Formal communications. Top-down from BloomBay or a club host to members.

### When to Use

- Community announcements (new feature, policy, welcome)
- Club rules displayed to members
- Safety alerts or community guidelines
- Founder announcements to the member body

### Notice Anatomy

```
[Optional: numeric reference or category eyebrow]
[Headline — Display md or strong UI]
[Body — UI base, 1.55 line-height, generous paragraph spacing]
[Optional: wax seal (for official BloomBay notices) or host signature]
```

Visual language: white background, `1px solid --bb-line-soft` border, `--radius-md`, subtle shadow.

### Notice vs. Wall Note

| | Notice | Wall Note |
|---|---|---|
| Direction | Top-down (BloomBay → member) | Peer-to-peer |
| Tone | Formal, official | Casual, community |
| Author | BloomBay / club host | Any member |
| Visual | Bordered document feel | Pinned note, push pin |
| Persistence | Permanent | Recent-first, scrollable |

---

## 13. Ticket System

Tickets are proof of belonging. They should feel like something worth keeping.

### Ticket Anatomy

```
[.bb-ticket]
  [.bb-ticket__header]    ← velvet black background
    "ADMITS ONE · HER"    ← .bb-ticket__admit (xs, caps, barbie pink)
    "BLOOMBAY"            ← .bb-ticket__brand (xs, caps, white 50%)
  [.bb-ticket__body]
    [.bb-ticket__title]   ← Display, large; key word in hot pink
    [.bb-ticket__meta-row]
      [.bb-ticket__meta-cell × 3]  ← Label (xs caps muted) + Value (ui-base bold)
  [.bb-ticket__perf]      ← perforation line + punch holes
  [.bb-ticket__stub]
    [.bb-ticket__barcode] ← CSS stripe pattern, 36px height
    [.bb-ticket__code]    ← reference number, xs, muted, centered
```

### Perforation Detail

```css
.bb-ticket__perf {
  height: 1px;
  background: repeating-linear-gradient(to right,
    rgba(26,5,20,0.2) 0px 6px, transparent 6px 12px);
}
.bb-ticket__perf::before,
.bb-ticket__perf::after {
  content: '';
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--bb-ivory-deep);
  position: absolute;
  top: 50%; transform: translateY(-50%);
}
.bb-ticket__perf::before { left: -24px; }
.bb-ticket__perf::after  { right: -24px; }
```

The punch holes bleed outside the card — they eat into the card's margin. This is intentional. It makes the ticket feel physically cut.

### Color Rules

- Header: always velvet black
- Body: ivory or white
- Most important event title word: hot pink
- Stub: slightly darker ivory, reads as the tear-off portion
- Barcode: velvet, 85% opacity

### Variants

`.bb-ticket--horizontal` — landscape layout, header becomes left vertical panel, perforation becomes vertical.

---

## 14. Bloom Request System

The most personal interaction in BloomBay. A woman saying: *I see something in you.*

### Design Requirements

A Bloom Request cannot look like a notification. It cannot look like a friend request. It is a folded letter that arrives sealed and opens when accepted.

### Bloom Request Component

`.bb-request-note`:

```
[.bb-request-note]
  [.bb-request-note__overline]  ← "YOU JUST RECEIVED A" — UI eyebrow muted
  [.bb-request-note__headline]  ← "BLOOM" (Display XL) + Request (Accent italic pink)
  [.bb-request-note__tagline]   ← "AN INVITATION TO A REAL CONNECTION" — xs caps muted
  [Wax seal — centered, large]
  [.bb-request-note__body]      ← Accent italic: "She sees something beautiful in you."
  [Profile section]             ← Photo + name + bio + location
  [Compatibility display]       ← % in Display XL hot pink + checklist
  [.bb-receipt]                 ← "To: You / From: A Woman / Reason: She sees your magic"
  [.bb-btn--hot block]          ← "Open Bloom Request →"
  [Ghost link]                  ← "Not now"
```

### Headline Composition

The "BLOOM Request" headline uses mixed typography:

```html
<h1 class="bb-request-note__headline">
  BLOOM<br>
  <span>Request</span>   ← Accent italic, hot pink, smaller
</h1>
```

Display font for BLOOM (uppercase, bold). Accent italic for Request (lowercase, script feel). The combination is the signature of this artifact.

### Compatibility Display

```
[94%]                     ← .bb-display-lg, --bb-hot
Amazing match energy ✿    ← .bb-accent-sm

[✓] Values aligned
[✓] Lifestyle aligned
[✓] Energy aligned
[✓] Vibe aligned
```

Minimum compatibility shown: 70%. Bloom Requests below this threshold are not surfaced.

### Privacy Rules

- The sender does not know if the request was opened
- The sender does not know if the request was declined
- Blocking after a request is invisible to the sender
- These are design requirements — the UI must never reveal this state

---

## 15. Component Reference

### Buttons

All buttons use `.bb-btn` as the base.

```css
.bb-btn {
  font-family: var(--font-ui);
  font-size: var(--text-ui-sm);  /* 0.8125rem */
  font-weight: 600;
  letter-spacing: 0.04em;
  border-radius: var(--radius-pill);  /* 100px */
  padding: 0.65rem 1.5rem;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  transition: transform var(--duration-fast) var(--ease-luxury),
              background var(--duration-fast) var(--ease-luxury),
              box-shadow var(--duration-fast) var(--ease-luxury);
}
```

| Variant | Class | Background | Text | Hover |
|---|---|---|---|---|
| Primary | `.bb-btn--hot` | `--bb-hot` | white | `--bb-hot-deep` + translateY(-1px) |
| Dark | `.bb-btn--velvet` | `--bb-velvet` | white | darker + translateY(-1px) |
| Outline | `.bb-btn--outline` | transparent | `--bb-velvet` | `--bb-velvet` fill |
| Outline Pink | `.bb-btn--outline-pink` | transparent | `--bb-hot` | `--bb-hot` fill |
| Ghost | `.bb-btn--ghost` | transparent | `--bb-velvet` | `--bb-line-soft` fill |

Sizes: `.bb-btn--lg` (larger) · `.bb-btn--sm` (smaller) · `.bb-btn--block` (full width)

### Form Inputs

```css
.bb-input {
  font-family: var(--font-ui);
  font-size: var(--text-ui-base);
  color: var(--bb-velvet);
  background: var(--bb-white);
  border: 1.5px solid var(--bb-line-soft);
  border-radius: var(--radius-sm);
  padding: 0.65rem 0.9rem;
  width: 100%;
  outline: none;
  transition: border-color var(--duration-fast);
}
.bb-input:focus {
  border-color: var(--bb-hot);
  box-shadow: 0 0 0 3px rgba(255, 0, 85, 0.1);
}
.bb-input::placeholder { color: var(--bb-muted); }
```

### Cards

`.bb-card` — standard white card, `--radius-md`, `--shadow-card`
`.bb-card--warm` — ivory background, soft border
`.bb-card--velvet` — velvet black background, white text

### Polaroid Strip

```css
.bb-polaroid-strip {
  display: flex;
  gap: var(--space-3);
  overflow-x: auto;
  padding: var(--space-2) var(--space-4) var(--space-4);
  scrollbar-width: none;
  scroll-snap-type: x mandatory;
}
.bb-polaroid-strip .bb-polaroid { flex-shrink: 0; width: 120px; }
/* Slight rotation variety */
.bb-polaroid-strip .bb-polaroid:nth-child(2n) { transform: rotate(1.5deg); }
.bb-polaroid-strip .bb-polaroid:nth-child(3n) { transform: rotate(-2deg); }
```

### Home Pillar Cards

`.bb-pillar` — member home navigation cards. Bordered, hot pink hover bar animates in from left.

---

## 16. Portal Design Language

### Member App
**Personality:** Warm, editorial, physically tactile
**Surfaces:** White cards on ivory
**All three fonts active**
**Key motifs:** Polaroids, envelopes, pinned notes, wax seals

### Mission Control (Founder + Admin)
**Personality:** High-trust, data-dense, editorial authority
**Surfaces:** White on white, rose-tinted accent panels
**Display for KPI numbers, UI for data labels**
**Key motifs:** Live metrics, geographic maps, serif editorial headings

### Clubhouse (Club Owner)
**Personality:** Operational, action-oriented, energetic
**Surfaces:** Barbie-soft pink, white grid cards
**Display for hub card titles, UI dominant**
**Key motifs:** 24+ card hub grid, hot pink borders everywhere

### Partner Portal
**Personality:** Business-grade, professional, revenue-focused
**Surfaces:** Clean white, minimal decoration
**UI font dominant**
**Key motifs:** Booking calendar, revenue stats, review ratings

### Curator Portal
**Personality:** Field-operative, streamlined, task-focused
**Surfaces:** Clean white
**UI dominant, minimal Display**
**Key motifs:** Compact task lists, payout rows

---

## 17. Flow Design

### The Full Member Flow

```
1. LANDING (/)
   ↓ [Open invitation] → animated envelope opens
   ↓ [Join Now / Choose path]

2. SIGNUP TYPE (/scene: signup-type)
   ↓ [Member path selected]

3. WAITLIST FORM (/scene: member-form)
   ↓ [Form submitted → Supabase waitlist insert]

4. CONFIRMATION (/scene: confirmed)
   ↓ [See you inside. Join the app →]

5. JOIN PAGE (/member/join)
   ↓ [Google / Phone OTP / Email+Password]
   ↓ [Auth → Supabase session created]

6. ONBOARDING (/member/onboarding)
   ↓ [8 steps: name → photo → location → new? → age → interests → about → gender]
   ↓ [Complete → /member/home]

7. HOME (/member/home)
   ↓ [Yande nudge → first action]

8. CLUBS (/member/clubs → /member/clubs/[id] → /member/clubs/[id]/join)
   ↓ [Join → /member/clubs/[id]/world]

9. HAPPENINGS (/member/happenings → /member/happenings/gatherings/[id])
   ↓ [RSVP → /api/irl/reserve → confirmed]
```

### The IRL Funnel

Target: complete within 14 days of joining.

```
Day 0:   Join + onboarding complete
Day 1-3: Pick at least one club
Day 3-7: RSVP to a gathering
Day 7-14: Attend the gathering → trust score activates
```

### Flow Rules

1. Every step has a clear forward route. No dead ends.
2. Back links always go to the immediate previous step.
3. Confirmation states are positive: "You're on the list ✓", not "Submission received."
4. Error states are specific: "This seat is already taken" not "Error 500."
5. Loading states exist for all async actions.

---

## 18. Do & Do Not

### Typography
✅ Pair Display headline with Accent italic subline
✅ Use `.bb-eyebrow` above every section header
✅ Keep Display text uppercase
✅ Use Accent italic for 1–2 lines max

❌ Use Accent italic for more than a short phrase
❌ Use Display below 1.2rem
❌ Use `--font-unbounded`, `--font-outfit`, or `--font-jost` (deprecated)
❌ Use any font other than the three canonical ones

### Colors
✅ Use CSS tokens — never hardcode hex
✅ `--bb-hot` for all primary actions
✅ `--bb-velvet` for primary text
✅ `--bb-ivory` as the default page background

❌ White text on barbie pink
❌ Hot pink on hot pink
❌ Hardcode `#ff0055` or any hex in component files

### Artifacts
✅ Use the artifact that matches the content type
✅ Make artifacts feel physical — perforations, seals, torn edges, pins
✅ Use the wax seal gradient (not `--bb-hot`) for the wax seal

❌ Generic card where an artifact exists for the content type
❌ Skip the perforation on a ticket
❌ Use a ticket for a Bloom Request (wrong artifact for the content)

### Navigation
✅ Back links to the immediate previous level
✅ Active states: unambiguous — hot pink, bold
✅ Mobile: bottom nav visible, sidebar hidden
✅ `padding-bottom: calc(72px + safe-area)` on mobile pages

❌ "Back to home" if the user came from another page
❌ Subtle or ambiguous active states
❌ Showing both sidebar and bottom nav simultaneously

### Motion
✅ `--ease-luxury` for all transitions
✅ All animations inside `prefers-reduced-motion` checks
✅ Let landmark moments animate in (envelope, wax seal, ticket reveal)

❌ `ease-in-out` for UI transitions
❌ New duration values outside the three canonical ones
❌ Motion that hides content for users with reduced motion

---

## 19. CSS File Map

| File | Contents |
|---|---|
| `app/styles/bloom-brand.css` | **Single source of truth** — all color tokens, font vars, spacing, motion, shadows, radii |
| `app/styles/bb-typography.css` | All type classes, button system, input system, utility classes |
| `app/styles/bb-artifacts.css` | All artifact components — ticket, envelope, wax seal, request, polaroid, wall note, club poster, torn note, pillar |
| `app/styles/globals-core.css` | Entry point — imports tailwind + bloom-brand; body defaults |
| `app/globals.css` | Root imports globals-core, bb-typography, bb-artifacts |
| `app/styles/bloombay.css` | Landing page form components — waitlist fields, suite buttons |
| `app/styles/invite-luxury.css` | Full invitation stage — envelope hero, flap animation, petals, letter |
| `app/styles/member-portal.css` | Member portal — header, bottom nav, cards, buttons, all `mp-*` classes |
| `app/styles/member-layout.css` | App shell — sidebar, main scroll, responsive layout |
| `app/styles/member-editorial.css` | Editorial layer — hero photo, torn note, polaroid strip, pill events |
| `app/styles/member-premium.css` | Premium tier overrides |
| `app/styles/founder-portal.css` | Mission Control — `fp-*` classes, KPIs, cards, admin layout |
| `app/styles/club-owner-portal.css` | Clubhouse — `co-*` classes, hub grid, club owner components |
| `app/styles/partner-portal.css` | Partner portal |
| `app/styles/curator-portal.css` | Curator portal |
| `app/styles/admin-dashboard.css` | Admin-specific overlays |
| `app/styles/bb-login.css` | Login pages — all 5 portals |
| `app/styles/club-world.css` | Club world canvas |
| `app/styles/crest.css` | Club crest system |
| `app/styles/luxury-motion.css` | Animation keyframes |
| `app/styles/portal-palette.css` | Cross-portal color aliases |
| `app/styles/portal-footer.css` | Portal footers |
| `app/styles/marketing-globals.css` | Marketing page utilities |
| `app/styles/marketing-bundle.css` | Landing/marketing bundle |

---

## 20. Asset Inventory

### SVG Objects — `public/bloom-assets/bloombay objects/`

| File | Quality | Used for |
|---|---|---|
| `bloom-crest.svg` | ✅ Clean vector | Club crest, decorative |
| `IMG_2710.svg` | ✅ Clean vector | Accent decoration |
| `IMG_2711.svg` | ✅ Clean vector | Accent decoration |
| `IMG_2712.svg` | ✅ Clean vector | Accent decoration |
| `bloom-ticket.svg` | ⚠️ Traced bitmap | Happenings nav — needs redesign |
| `bloom-request.svg` | ⚠️ Traced bitmap | Bloom Request — needs redesign |
| `bloom-bouquet.svg` | ⚠️ Traced bitmap | Crest motif — needs redesign |
| `bloom-door.svg` | ⚠️ Traced bitmap | The Room — needs redesign |
| `bloom-key.svg` | ⚠️ Traced bitmap | Founder portal — needs redesign |
| `bloom-pin.svg` | ⚠️ Traced bitmap | Maps — needs redesign |
| `bloom-postcard.svg` | ⚠️ Traced bitmap | Library crest — needs redesign |
| `bloom-table.svg` | ⚠️ Traced bitmap | Dinner crest — needs redesign |

**Action required:** Commission clean hand-drawn SVGs for all ⚠️ objects. Traced bitmaps render as flat black silhouettes with jagged bezier curves — they do not scale cleanly or accept CSS color via `currentColor`.

### Reference Photos — `public/bloom-assets/refs/`

| File | Used for |
|---|---|
| `home-hero.jpg` | Member home hero image |
| `lounge.jpg` | Lounge hero |
| `planner.jpg` | Planner page reference |
| `tonight.jpg` | Tonight page / partner portal |
| `zones.jpg` | Club zones page |

### Logo Marks — `public/logosbloombay/`

| File | Use |
|---|---|
| `Vector-1.svg` | Logo mark — active/colored state |
| `Vector.svg` | Logo mark — neutral/white state |

---

## 21. Decision Log

*The why behind every non-obvious design decision.*

| Decision | Reason | Date |
|---|---|---|
| Hot pink changed from `#E8007A` → `#FF0055` | `#E8007A` was too magenta. `#FF0055` is more saturated, prints correctly, and reads as pink-red rather than violet-pink. | Jun 2026 |
| Velvet black changed from `#1A0A2E` → `#1A0514` | `#1A0A2E` was too blue-purple (indigo bias). `#1A0514` is warmer, closer to dark wine, pairs better with ivory and hot pink. | Jun 2026 |
| Added Barlow Condensed as Display font | Previous `--font-unbounded` (Unbounded) is geometric and neutral — too clean for BloomBay's editorial/poster ambition. Barlow Condensed is compressed, athletic, newspaper-like. | Jun 2026 |
| Added Cormorant Garamond as Accent font | DM Sans was used for all non-display text. Added Cormorant to create a meaningful contrast between declaration (Barlow) and emotion (Cormorant). | Jun 2026 |
| Sidebar hidden on mobile, bottom nav enabled | Reference images show a mobile-first bottom nav. The 76px collapsed sidebar is confusing — icon-only navigation with 7 items is too dense. | Jun 2026 |
| Onboarding always redirects to `/member/home` | Previous logic sent to `/member/pending-approval` which had only "Sign in later" — a dead end. Verification is now async (founder portal reviews). Members get immediate access. | Jun 2026 |
| RSVP calls `/api/irl/reserve` before local store | Previous implementation wrote to localStorage only — lost on refresh, invisible to founder dashboard. API call added. Local store remains as instant feedback + offline fallback. | Jun 2026 |
| Club join calls `/api/irl/join-club` | Same reason — club memberships must persist to Supabase `club_memberships` table to be visible in founder portal and Cohort-14 tracking. | Jun 2026 |
| Wax seal uses dark rose, not `--bb-hot` | Hot pink (#FF0055) reads as a UI element (button, accent). Dark rose (#8b1a3a → #c9527a) reads as a material object (wax). The distinction is intentional — the seal is not the brand; it is a physical artifact. | Jun 2026 |
| Perforation punch holes bleed outside card | If the punch holes sit inside the card, the ticket reads as a card with decoration. If they bleed outside, the ticket reads as a physical tear-perforated object. The bleed creates the illusion. | Jun 2026 |

---

*BloomBay Design Bible v1 — June 2026*
*Update this document when: a new design pattern is established, a token changes, a component is added, or a decision is reversed.*
*This is a living document. A design system that isn't updated isn't a system — it's archaeology.*
