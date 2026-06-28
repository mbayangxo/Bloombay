# BloomBay Architecture Decisions

> **Don’t build more systems. Finish defining the systems you already have.**

> **Rules, not discussions.** One line per decision. Update when the founder approves a change — never fork parallel systems silently.

**Last updated:** 2026-06-08 (V1 architecture frozen; Phase A database docs)  
**Review with:** `DOMAIN_BOUNDARIES.md`, `DATABASE_ARCHITECTURE.md`, `DATABASE_PRINCIPLES.md`, ChatGPT + Cursor review sessions

**Workflow:** Product questions get **grounded** in schema/code before anyone writes features. You define → ChatGPT pressure-tests → Cursor verifies → Claude implements only after a decision lands here.

---

## How to use this file

Before any new table, API, or feature:

1. Which **domain** owns this? (`DOMAIN_BOUNDARIES.md`)
2. Which **existing table** is canonical?
3. If creating something new — **why can't an existing table be extended?**

If you can't answer all three, stop and review.

---

## V1 architecture — frozen (2026-06-08)

**Order of truth:** Product decision → Architecture decision → Documentation → Database → API → UI. Never code first, document later.

### Four layers (do not conflate)

| Layer | What it is | Example |
|-------|------------|---------|
| **Pillar** | Product world / question answered | Home, Happenings, City, Clubs, Avenue, Plans |
| **Bottom nav** | V1 thumb-reach slots (packaging choice) | May be 5 tabs today; 6 when Avenue promoted |
| **Route** | URL in code | `/member/home`, `/member/avenue` |
| **Label** | What the member reads | Time-of-day on Home tab — **never the word “Home”** on the bar |

**Pillars ≠ bottom nav.** Trust, Yande, Connect are pillars/infra without tabs. Avenue is a **first-class pillar**; V1 bottom-nav placement is a **product decision**, not a code constraint.

### Home pillar

| Layer | Rule |
|-------|------|
| **Pillar** | Personal world — Yande, plans, invitations, friend activity, recommendations, attention |
| **Route** | `/member/home` |
| **Nav label** | Time-of-day: *This Morning*, *This Afternoon*, *This Evening*, *Tonight* — dynamic, never “Home” |
| **Philosophy** | BloomBay is bigger than tonight; Home works all day |

### Happenings & gatherings

| Layer | Rule |
|-------|------|
| **Product** | **Happenings** is the home for what’s happening — browse, discover, reserve |
| **Lingo** | **Gathering** = BloomBay word for an event |
| **Database** | **`gatherings`** = canonical table; **`events`** = legacy, frozen — no new writes |
| **City / Clubs** | May surface or link gatherings; do not own the calendar |

### Avenue

First-class culture pillar (Wall, Fashion, Reading Room, Screening Room, Girl Working, Magazine). Build as a first-class domain internally. V1 may surface from Home + notifications without a bottom-nav slot until promoted.

### Introductions (Connect)

**Contextual, not a standalone nav world.** Same `introductions` table; surfaced where shared context exists:

| Surface | Context |
|---------|---------|
| **Clubs** | “She’s also in Photography Club.” |
| **Happenings** | “She’s at the same brunch.” |
| **City** | “She’s new to SoHo.” |

No standalone Connect/Introductions bottom tab for V1. Not a dating-directory product.

### V1 bottom nav (current implementation)

Five slots in `lib/member-nav.ts`: time-of-day Home, City, Clubs, Plans, Happenings. Avenue reachable via Home, deep links, notifications. Sixth tab when product decides culture deserves the bar.

---

## BloomBay OS — six pillars (member nav)

BloomBay is a **social operating system** with six pillars — not one funnel or “loop.” Women enter through different doors; all are valid.

| Tab | Route | Core question | Dimension |
|-----|-------|---------------|-----------|
| **Home** | `/member/home` | What’s happening in *my* BloomBay? | Personal |
| **Happenings** | `/member/happenings` | What can I do? | Time |
| **City** | `/member/city` | Where should I go? | Place |
| **Clubs** | `/member/clubs` | Who do I belong with? | Community |
| **Avenue** | `/member/avenue` | What are women talking about? | Culture |
| **Plans** | `/member/plans` | What have I committed to? | Commitments |

**Do not describe BloomBay as a single “North Star loop.”** Pillars converge in **real life** (attending gatherings) and **relationships** (Connect, trust) — no required tab order.

### What each pillar contains (product)

| Tab | Includes |
|-----|----------|
| **Home** | Yande, upcoming plans, invitations, friend activity, recommended gatherings, attention items |
| **Happenings** | Today, tomorrow, weekend, open seats, festivals, club + independent gatherings |
| **City** | Maps, eats, solo, girl gems, favorites, trending, Bloom Notes |
| **Clubs** | Discover, my clubs, club walls, club gatherings, members, traditions, **Introductions (V1)** |
| **Avenue** | Wall, Fashion, Reading Room, Screening Room, Girl Working, Magazine |
| **Plans** | Upcoming, hosting, saved, past, invitations, calendar |

### Discovery → real world

**Happenings, City, and Clubs** are the three **discovery** pillars (When / Where / Who).  
**Gathering** = BloomBay word for an event. **`gatherings`** is the canonical table in code/schema.  
**Happenings** is the primary product home for gatherings — today, tomorrow, weekend, open seats, festivals, club gatherings, and independent gatherings are all gatherings.  
**City** and **Clubs** can surface or link to gatherings (e.g. club-hosted gathering, gathering at a city spot) but do not own the calendar.

```
        HOME (personal dashboard)
              │
    ┌─────────┼─────────┬─────────┐
    │         │         │         │
 HAPPENINGS  CITY    CLUBS    AVENUE · PLANS
  (When)   (Where)   (Who)   (Culture)(Commitments)
    │
 gatherings live here (`gatherings` table)
    │
 City & Clubs ── surface / link gatherings
              │
        RELATIONSHIPS (Connect, trust)
```

| Decision | Status |
|----------|--------|
| Six pillars = six questions — healthy IA; do not collapse tabs | ✅ Rule |
| No single funnel; any tab is a valid entry point | ✅ Rule |
| **Happenings** owns gatherings as the primary product surface | ✅ Rule |
| **Gathering** = BloomBay lingo for event; **`gatherings`** = canonical table | ✅ Rule |
| City and Clubs may surface/link gatherings — not a fourth nav pillar | ✅ Rule |
| **`events`** is legacy — no new writes | ✅ Freeze |
| UI may say Happenings; code says `gatherings` | ✅ Rule |
| **`bloomies_plans`** stays separate from gatherings (personal commitments, not public calendar) | ✅ Active |

---

## Connect (one product, multiple layers)

| Layer | Canonical table | Job |
|-------|-----------------|-----|
| Introductions | `introductions` | "Here's who I am." (discovery profile) |
| Come With Me | `come_with_me_posts` + `come_with_me_joins` | "I'm going somewhere." (ephemeral, ~7 days) |
| Bloom Request | `bloom_requests` | "Let's connect." (1:1 opt-in) |
| Friendship health | `friendship_scores` | Yande read model — not user-facing schema |

**V1 UI:** **Introductions are contextual** — Clubs, Happenings, and City surfaces (see V1 frozen architecture). No standalone Connect nav tab.

**Post-beta:** Broader Connect experience if density warrants.

**Rule:** Unify in **product** over time; do **not** merge tables before beta. No standalone Connect bottom tab required for V1.

---

## Avenue & content boundaries

**Avenue** = rooms + conversation culture (editorial district). Not one table — two layers:

### Avenue rooms (curated / editorial)

| Room | Canonical | Job |
|------|-----------|-----|
| BloomBay Magazine | `avenue_content` (`room=magazine`) | Editorial |
| Fashion Avenue | `avenue_content` + `fashion_posts` | Style room |
| Reading Room | `avenue_content` | Books / thoughts |
| Screening Room | `avenue_content` | Shows / movies |
| Girl Working | `avenue_content` | Work / career |
| Eats, Wellness, Vanity, etc. | `avenue_content` | Other curated rooms |

New **curated** room content → `avenue_content` (approval workflow, `week_of`, etc.).

### Avenue conversation layer

| Surface | Canonical | Job |
|---------|-----------|-----|
| **Wall Posts** | `wall_posts` | **Inside Avenue** (`/member/avenue/wall`) — conversation prompts, questions, random thoughts, discussion starters so women talk to each other. **Not** personal activity updates. |

### Outside Avenue (separate domains)

| Surface | Canonical | Job |
|---------|-----------|-----|
| **Bloom Notes** | `bloom_notes` | Place-based knowledge women leave for other women (order this, safety tip, best table) |
| **Moments** | `moments` | Private memories in the Lounge (author-only RLS) |
| **Gatherings** | `gatherings` | BloomBay word for events — primary surface is **Happenings** (see Happenings pillar) |
| **Plans** | `bloomies_plans` | Private / small-group coordination (see IRL section) |

**Rules:**

- **No big-bang content merge before beta.**
- Wall Posts = Avenue **discussion layer** — never describe as "what I'm doing" or personal status.
- Bloom Notes = **place intelligence** — not Wall, not Avenue editorial.
- Moments = **Lounge** — private; not Wall.
- **`community_posts`** — frozen; no new features.
- Wall and editorial Avenue may share infrastructure (comments, flowers, moderation) — not merged tables.

---

## Bloom Notes = Knowledge (not “content”)

Bloom Notes are **place-based knowledge** women leave for other women — not posts, not reviews, not editorial.

| Layer | What it is |
|-------|------------|
| Wall | Conversation |
| Avenue | Publishing / rooms |
| Magazine | Editorial |
| Moments | Private memory |
| **Bloom Notes** | **Knowledge** |

**Own:** product experience, API, business logic (`bloom_notes`, place indexing, search, helpful votes over time).  
**Share:** comments, moderation, reactions, permissions, notifications (infrastructure only).

Knowledge behaviors (build over time): location indexing, search, trust/reputation on notes, freshness, helpful votes, map integration, recommendations. These are **not** feed behaviors.

**Beta:** Knowledge lives as its own product lane; may appear under the Content pillar in diagrams for simplicity.  
**Post-beta:** Knowledge may become a top-level pillar alongside Content if the city guide grows.

**Rule:** Do not merge into `wall_posts` or `avenue_content`. Do not describe as a content feed.

---

## Messaging

| Context | Canonical (beta) | Canonical (post-beta) |
|---------|------------------|----------------------|
| General DMs | `conversations` + `direct_messages` | Same |
| GirlMate / housing | `girlmate_messages` | Migrate to `conversations.type = 'girlmate'` |
| Hanger marketplace | `hanger_messages` | Evaluate merge post-beta |
| Plan rooms | `bloomies_plan_messages` | Evaluate merge post-beta |

**Rule:** No new parallel message tables. GirlMate stays isolated for beta (listing_id, rate limits, blocks).

---

## Safety & reports

| Decision | Status |
|----------|--------|
| **One canonical member-to-member report pipeline** — P0 before launch | 🔴 TODO — design before API audit |
| Today: `user_reports` (API) + `member_reports` (Yande/moderation) + `safety_reports` (support form) — dual-write mirror in `/api/member/report` | 🔴 TODO |
| **`safety_reports`** stays separate — account/contact safety, not member-to-member reports | ✅ Rule |
| **`content_moderation`** stays for content — links to `moderation_cases` when needed | ✅ Active |
| **`moderation_cases`** for human review queue | ✅ Active (migration 115) |
| High severity → `human_review_required`, not auto-reviewed | ✅ Rule |
| **`user_blocks`** enforced in all contact surfaces | 🟡 Ongoing |

---

## Yande / AI memory

| Decision | Status |
|----------|--------|
| Yande = **memory + guidance**, not a chatbot everywhere | ✅ Rule |
| **Canonical write:** `member_behavior_signals` | ✅ Active |
| **Canonical read/context:** `yande_user_context` | ✅ Active |
| `yande_memory`, `yande_memories`, `memory_events` — document & deprecate stubs; no new writes without owner | 🟡 TODO — see `YANDE_MEMORY_POLICY.md` (pending) |
| Yande recommends; humans approve bans/restrictions | ✅ Rule |

---

## Identity & access

| Decision | Status |
|----------|--------|
| Supabase Auth → `profiles` → role/member fields | ✅ Active |
| Admin/founder: Supabase session + `profiles.role` — **no** `ADMIN_PASSWORD` | ✅ Active |
| Member actions write to Postgres first (truth layer) | ✅ Active |
| `public_profiles` view for safe member discovery | ✅ Active |

---

## Commerce

| Decision | Status |
|----------|--------|
| Stripe is primary; Whop legacy | ✅ Rule |
| Tickets/orders: `pending_orders`, `tickets` | ✅ Active |

---

## Crons & notifications

| Decision | Status |
|----------|--------|
| `CRON_ENABLED` opt-in; `CRON_DRY_RUN` for testing | ✅ Active |
| No SMS from crons | ✅ Rule |
| SMS only: `private_beta_accepted`, `app_launch`, future `phone_verification`, `urgent_safety` | ✅ Rule |
| All sends through `createNotificationEvent` over time | 🟡 Partial |

---

## Storage

| Decision | Status |
|----------|--------|
| Government IDs / verification selfies → **private buckets only**, signed URLs | ✅ Active (migration 117) |
| No base64 persistence in DB | ✅ Rule |
| UUID filenames only | ✅ Rule |

---

## Explicitly postponed (post-beta)

- Merge `wall_posts` + `avenue_content`
- Merge `bloom_notes` into polymorphic content table
- Migrate `girlmate_messages` → `conversations`
- Drop `events` table (after data migration)
- Global polymorphic `content` table
- Unify all Yande memory tables in one migration

---

## Decision log (changelog)

| Date | Decision |
|------|----------|
| 2026-06-08 | **V1 architecture frozen** — pillars ≠ nav ≠ routes ≠ labels; Home time-of-day nav; contextual Introductions |
| 2026-06-08 | Phase A database docs: `DATABASE_PRINCIPLES.md`, `MIGRATION_APPLY_ORDER.md`; reports design before migration |
| 2026-06-25 | Six nav pillars (Home, Happenings, City, Clubs, Avenue, Plans); no single loop |
| 2026-06-25 | Introductions inside Clubs for V1 |
| 2026-06-25 | Gatherings live in Happenings; `gatherings` table canonical; City/Clubs link/surface only |
| 2026-06-25 | Three discovery dimensions: City (Where), Clubs (Who), Happenings (When) |
| 2026-06-25 | Avenue = rooms + culture; Wall Posts = Avenue conversation layer (not personal updates) |
| 2026-06-25 | Bloom Notes = Knowledge domain (own product; shared infra only) |
| 2026-06-25 | Connect = one product, four layers, separate tables |
| 2026-06-25 | Reports consolidation P0 before launch |
| 2026-06-25 | community_posts frozen |
