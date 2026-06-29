# Districts: The Avenue vs The City vs Happenings — and The Edit

**Status:** canonical product model. **Do NOT build The Edit yet** — this doc
exists to *preserve the architecture and naming* so future implementation does
not merge City, Avenue, and Happenings together.

Last updated: 2026-06-29.

---

## The three districts are SEPARATE. Never merge them.

| District | What it is | Route namespace | Nature |
|---|---|---|---|
| **The Avenue** | BloomBay's digital social + editorial district | `/member/avenue/**` | digital |
| **The City** | Physical / local discovery | `/member/city/**` | physical / local |
| **Happenings** | Events, gatherings, invitations, seats | `/member/happenings/**` | events |

Hard rules:
- The Avenue is **digital/editorial**. The City is **physical/local**. They are
  different districts and must keep separate route namespaces and components.
- **The Edit lives in The Avenue**, never in The City.
- The City *can surface* city recommendations (Eats, Solo, Go, Girl Gems, Drops,
  neighborhoods, places to visit) — but it is **not** the editorial hub.
- Do not collapse City + Avenue + Happenings into a shared page, feed, or model.

---

## The Avenue contains public digital "places"

Current + planned Avenue surfaces (all under `/member/avenue/`):
- **The Wall** (`/wall`) — community posts
- **Fashion Avenue / The Closet** (`/closet`)
- **The Vanity** (`/vanity`)
- **Wellness / Health district** (`/wellness`)
- **Reading Room** (`/reading-room`) and **Screening Room** (`/screening-room`) — editorial areas
- **Girl Working** (`/working`)
- **The Edit** (`/edit`) — *not built yet; see below*

(`/magazine` and `/column` currently exist as standalone Avenue surfaces; under
the model below they become part of **The Edit**.)

---

## The Edit — Avenue editorial hub (FUTURE; not yet in scope)

The Edit is the Avenue's editorial hub. It supports multiple editorial types:

1. **Member Edits** — editorials written by members/women: personal essays,
   guides, stories, recommendations, reflections.
2. **Club Edits** — editorials/publications created by Clubs. Each Club can have
   its own voice/publication. Examples: *The Lookbook*, *The Bookmark*,
   *The Reel*, *The Garden Journal*, *The Ledger*.
3. **BloomBay Edit** — official curated BloomBay picks. Shorter, timely, curated.
   Examples: designers to watch, weekend style, women-owned finds, cultural
   recommendations.
4. **BloomBay Magazine** — higher-level editorial world-building: bigger
   features, interviews, guides, essays, city/culture pieces.

When The Edit is implemented, it lives at `/member/avenue/edit` (or sub-routes
under it), and the existing `magazine`/`column` surfaces fold into it. It must
**not** be placed under `/member/city`.

---

## Why this matters

City, Avenue, and Happenings each have their own logic and energy. Merging them
(e.g. putting editorial content in The City, or folding Happenings into a
generic feed) destroys the product's structure. Preserve the boundaries and the
naming above in any future work.
