# BloomBay Domain Boundaries

> **Don’t build more systems. Finish defining the systems you already have.**

> **Product ownership map** — not schema detail, not code layout.  
> Before creating `new_table`, answer: **Which domain owns this?**  
> If you can't answer, the table probably shouldn't exist.

**Companion docs:** `DECISIONS.md` · `PRODUCT_ARCHITECTURE.md` · `DATABASE_ARCHITECTURE.md` · `DATABASE_PRINCIPLES.md`

---

## V1 frozen — four layers

Do not conflate these:

| Layer | Example |
|-------|---------|
| **Pillar** | Home, Happenings, City, Clubs, Avenue, Plans |
| **Bottom nav** | V1: 5 tabs in code; Avenue pillar may not have a slot yet |
| **Route** | `/member/home`, `/member/avenue/wall` |
| **Label** | Home tab shows time-of-day (*Tonight*, *This Evening*) — never “Home” on the bar |

**Pillars ≠ bottom nav.** Avenue is a first-class pillar; nav placement is a product decision. Introductions are contextual surfaces, not a nav world.

---

## Product pillars

Six product worlds. Healthy IA — do not collapse into one funnel.

| Pillar | Question | Dimension | Route | Nav label (V1) |
|--------|----------|-----------|-------|----------------|
| **Home** | What's happening in *my* BloomBay? | Personal | `/member/home` | Time-of-day (never “Home”) |
| **Happenings** | What can I do? | Time | `/member/happenings` | Happenings |
| **City** | Where should I go? | Place | `/member/city` | City |
| **Clubs** | Who do I belong with? | Community | `/member/clubs` | Clubs |
| **Avenue** | What are women talking about? | Culture | `/member/avenue` | Not in bottom nav V1* |
| **Plans** | What have I committed to? | Commitments | `/member/plans` | Plans |

\*Avenue is first-class in architecture; reach via Home, notifications, deep links until promoted to tab #6.

| Pillar | Includes |
|--------|----------|
| **Home** | Yande, plans, invitations, friend activity, recommendations, attention |
| **Happenings** | Today, weekend, open seats, festivals — **all gatherings live here** |
| **City** | Maps, eats, solo, girl gems, favorites, trending, Bloom Notes |
| **Clubs** | Discover, my clubs, walls, members, traditions, **contextual Introductions** |
| **Avenue** | Wall, Fashion, Reading Room, Screening Room, Girl Working, Magazine |
| **Plans** | Upcoming, hosting, saved, past, invitations, calendar |

**BloomBay OS:** A social operating system with six pillars converging in **real life** (attending gatherings) and **relationships** (Connect, trust). Any tab is a valid entry point — not a single “loop.”

| Cross-cutting (schema / infra — not nav pillars) | Examples |
|--------------------------------------------------|----------|
| **Knowledge** | `bloom_notes` (place intelligence) |
| **Social** | `introductions`, `bloom_requests`, `girlmate_profiles` |
| **Memory** | `moments`, `member_behavior_signals` |
| **Commerce** | `bloom_drops`, `tickets` |
| **Safety** | `moderation_cases`, reports |

**Gatherings:** BloomBay word for events. **`gatherings`** table is canonical in code/schema. **Happenings** is the primary product home; City and Clubs may surface or link gatherings — not a fourth nav pillar.

**Introductions V1:** **Contextual** in Clubs, Happenings, and City — not a standalone nav world. Graduate to broader Connect post-beta.

---

## Three discovery dimensions (subset of six pillars)

Happenings, City, and Clubs answer **When / Where / Who**.

| Dimension | Tab | Question | Gatherings |
|-----------|-----|----------|------------|
| Time | Happenings | What can I do? | **Primary home** — today, weekend, open seats, festivals, all gatherings |
| Place | City | Where should I go? | May link gatherings at a city spot |
| Community | Clubs | Who do I belong with? | May surface club-hosted gatherings |

Same gathering: lives in **Happenings**, may be hosted by a Club, at a City spot. One `gatherings` row.

---

## Three questions (every new feature)

1. **Which domain owns this?**
2. **Which existing table is the canonical source of truth?**
3. **If it creates a new table — why can't an existing one be extended?**

---

## Domain map

```
              HOME (personal)
                    │
    ┌───────┬───────┼───────┬───────┐
    │       │       │       │       │
HAPPENINGS CITY  CLUBS  AVENUE  PLANS
  (When) (Where) (Who) (Culture)(Commit)
    │
 gatherings live here
    │
 City & Clubs ── surface / link
                    │
         CONNECT · TRUST · MEMORY
                    │
    KNOWLEDGE · COMMERCE · SAFETY · OPS
```

**Identity** (`profiles`) connects every pillar. **Discovery** (Happenings, City, Clubs) is three dimensions — not a linear loop. **Gathering** = BloomBay word for event; **`gatherings`** table is canonical.

```
BloomBay Platform
│
├── IDENTITY ───────────── profiles, waitlist, member_applications, verification
├── HOME ───────────────── dashboard, Yande home surface, attention
├── DISCOVERY ──────────── Happenings (when + gatherings) · City (where) · Clubs (who + Introductions V1)
├── AVENUE ─────────────── rooms (editorial) + wall_posts (conversation)
├── PLANS ───────────────── bloomies_plans, calendar, hosting
├── CONNECT ────────────── introductions (Clubs V1), come_with_me, bloom_requests
├── KNOWLEDGE ──────────── bloom_notes (place intelligence)
├── MEMORY ─────────────── moments, yande signals/context
├── MESSAGING ───────────── conversations, girlmate_messages, notifications
├── GIRLMATES ───────────── girlmate_profiles, listings
├── SAFETY ──────────────── reports, blocks, moderation_cases
├── COMMERCE ────────────── tickets, orders, drops, hanger
└── OPS ──────────────────── mission control, audit, cron logs
```

**IRL schema** (`gatherings`, seats, attendance, witnesses) is owned by the **Happenings** product domain — not a separate nav pillar.

---

## Domain reference

### Identity
**Owner:** Membership / Auth  
**Job:** Who is this woman? Is she verified? What role?

| Canonical | Purpose |
|-----------|---------|
| `profiles` | Extended user record (role, member, city, verification) |
| `waitlist` | Pre-member pipeline |
| `member_applications` | Apply → approve flow |
| Storage: `government-ids`, `verification-selfies` | Private verification media |

**Boundaries:** Auth lives in Supabase `auth.users`. Never duplicate identity in app-only state.

---

### IRL (gatherings schema — Happenings product)
**Owner:** Happenings product  
**Job:** Scheduled real-world experiences with seats, check-in, social proof. **Gathering** = BloomBay word for event.

| Canonical | Purpose |
|-----------|---------|
| `gatherings` | **The** event table |
| `seat_reservations` | RSVP / seat holds |
| `gathering_attendance` | Check-in truth |
| `gathering_witnesses` | Post-event social proof |

**Legacy (freeze):** `events`, `event_attendees` — no new writes.

**Boundaries:** Not the same as Plans (personal coordination) or Club posts (community feed). Not a separate nav pillar.

**Product IA:** **Happenings** is the primary home for gatherings. **City** and **Clubs** are sibling discovery surfaces that may link or surface gatherings (where, who) — geography and host club are attributes of the gathering, not parent pages.

---

### City
**Owner:** City / Explore product  
**Discovery dimension:** **Where should I go?**

| Canonical | Purpose |
|-----------|---------|
| City data, `city_trending` | Neighborhoods, eats, solo, girl gems, maps, favorites |
| `bloom_notes` | Place knowledge (Knowledge pillar) |

**Boundaries:** City is not Clubs. Not a funnel step before clubs. May link gatherings at a place — discovery of gatherings primarily flows through Happenings.

---

### Happenings
**Owner:** Happenings product  
**Discovery dimension:** **What can I do?** (when)  
**Primary home for gatherings** — BloomBay word for events.

| Canonical | Purpose |
|-----------|---------|
| `gatherings` | Real-world events — tonight, weekend, open seats, festivals, club-hosted, independent |
| `seat_reservations` | RSVP |

**Boundaries:** Happenings **is** where gatherings live in the product — not a separate event entity or cross-cutting IRL pillar. Club-hosted and independent gatherings both appear here. City and Clubs may surface or link to the same `gatherings` row.

---

### Community (Clubs)
**Owner:** Clubhouse / Club Mama  
**Discovery dimension:** **Who do I belong with?**

| Canonical | Purpose |
|-----------|---------|
| `clubs` | Club entity (brand, crest, slug) |
| `club_memberships` | Member ↔ club |
| `club_applications` | Join requests |
| `club_broadcasts` | Club → members messaging |
| `club_posts` | Club-scoped feed (separate from Wall) |

**Boundaries:** Club Owner portal owns this domain. Member Host creates `gatherings` but doesn't own club entity. Club pages may surface club-hosted gatherings — primary calendar remains **Happenings**.

---

### Connect
**Owner:** Connection / Introductions product  
**Job:** Help women discover each other and opt into connection.

| Layer | Canonical | User-facing job |
|-------|-----------|-----------------|
| Profile card | `introductions` | "Here's who I am." |
| Spontaneous invite | `come_with_me_posts` | "I'm going somewhere." |
| Opt-in request | `bloom_requests` | "Let's connect." |
| Health metric | `friendship_scores` | AI relationship signal (read model) |

**Boundaries:** One product in UI; separate tables by lifecycle. Beta-critical path = `bloom_requests`.

---

### Avenue
**Owner:** Editorial / culture product  
**Job:** Rooms + conversation culture — the city's editorial district.

```
Avenue
├── Editorial / curated rooms     → avenue_content
│   ├── BloomBay Magazine
│   ├── Fashion Avenue
│   ├── Reading Room
│   ├── Screening Room
│   ├── Girl Working
│   ├── Eats, Wellness, Vanity, …
│
└── Conversation layer            → wall_posts
    └── The Wall (/member/avenue/wall)
        Questions, prompts, random thoughts, discussion starters
```

| Layer | Canonical | Job |
|-------|-----------|-----|
| **Curated rooms** | `avenue_content` | Editorial picks, magazine, screening, career, eats — approval workflow |
| **Wall Posts** | `wall_posts` | **Avenue conversation layer** — prompts and questions so women talk inside Avenue |

**Wall Posts are not:**
- Personal "what I'm doing" updates
- A status feed or activity log
- Separate from Avenue (Wall lives inside Avenue)

**Wall Posts are:**
- Conversation prompts and questions
- Random thoughts and discussion starters
- Community talk inside Avenue

**Boundaries:** Fashion may also use `fashion_posts` today — long-term align with `avenue_content` room model; do not merge Wall into editorial tables.

---

### Knowledge (Bloom Notes)
**Owner:** City / place intelligence product  
**Job:** What women should know about a place — left for the next woman. Not conversation, not editorial, not private memory.

| Canonical | Purpose |
|-----------|---------|
| `bloom_notes` | Place-tied knowledge snippets |
| (future) place pages, helpful votes, map index | Knowledge-system behaviors |

**Own:** product surface, API, business logic.  
**Share:** comments, flowers, moderation, notifications, permissions.

**Not content-feed behaviors:** Knowledge wants search, location indexing, trust on tips, freshness, map integration, recommendations.

**Boundaries:** Separate from Avenue, Wall, Moments. See `DECISIONS.md`.

---

### Content (outside Avenue)

| Sub-domain | Canonical | Job |
|------------|-----------|-----|
| **Moments** | `moments` | Private memories in the Lounge (author-only RLS) |

**Frozen:** `community_posts` — early experiment; no new features.

**Shared infrastructure (OK):** `post_comments`, `post_flowers`, moderation — not merged product tables.

---

### Messaging
**Owner:** Platform / Safety  
**Job:** Direct communication between members.

| Canonical (beta) | Context |
|------------------|---------|
| `conversations` + `direct_messages` | General DMs |
| `girlmate_messages` | Housing — listing context, stricter rules |
| `notifications` | In-app notification inbox |
| `notification_events` | Delivery audit log |

**Post-beta:** `girlmate` → `conversations.type = 'girlmate'`.

**Rule:** No fifth message table without domain review.

---

### Girlmates (New Keys)
**Owner:** Housing product  
**Job:** Roommate / sublet discovery with safety-first messaging.

| Canonical | Purpose |
|-----------|---------|
| `girlmate_profiles` | Listings / seeker profiles |
| `girlmate_messages` | DM with `listing_id` context |

**Boundaries:** Separate from Connect (friendship) and Community (clubs). Shares Safety + Messaging infrastructure.

---

### Safety
**Owner:** Trust & Safety / Moderation  
**Job:** Protect women — report, block, review, audit.

| Canonical | Purpose |
|-----------|---------|
| `user_blocks` | Block enforcement |
| `member_reports` / `user_reports` | **Consolidate to one** — P0 |
| `moderation_cases` | Human review queue |
| `admin_audit_logs` | Staff action audit |
| `safety_reports` | Support/safety intake form (may stay separate from member reports) |

**Boundaries:** Yande flags; humans decide bans. High severity → `human_review_required`.

---

### Yande
**Owner:** AI / Memory product  
**Job:** Behavior-aware memory and guidance — not chat everywhere.

| Canonical | Purpose |
|-----------|---------|
| `member_behavior_signals` | Raw event log (writes) |
| `yande_user_context` | Aggregated per-user context (reads) |
| `yande_match_queue` | Match suggestions (when live) |

**Deprecated / no new writes without review:** `yande_memory`, scattered memory stubs.

**Boundaries:** Crons read behavior, write nudges/notifications — not SMS blasts. No auto-ban.

---

### Commerce
**Owner:** Payments / Marketplace  
**Job:** Tickets, memberships, drops, hanger.

| Canonical | Purpose |
|-----------|---------|
| `pending_orders`, `tickets` | Stripe checkout |
| `bloom_drops`, `drop_claims` | Partner drops |
| `hanger_listings`, `hanger_messages` | Marketplace |

---

### Plans
**Owner:** Personal planning product  
**Job:** Small-group coordination, plan rooms, calendar — not public happenings.

| Canonical | Purpose |
|-----------|---------|
| `bloomies_plans` | Plan entity |
| `bloomies_plan_invites`, `bloomies_plan_messages` | Coordination |

**Boundaries:** A plan may *attach to* a gathering; it does not replace `gatherings`.

---

### Ops (Mission Control)
**Owner:** Founder / Admin  
**Job:** Approve, monitor, configure — read-heavy, audited writes.

| Canonical | Purpose |
|-----------|---------|
| `admin_audit_logs` | Who changed what |
| `cron_logs` | Scheduled job runs |
| `upload_audit_logs` | File upload audit |

**Boundaries:** Service role + role guards. Founder-only for destructive bulk.

---

## RLS priority by domain (beta)

| Priority | Domains / tables |
|----------|------------------|
| **P0** | Identity (`profiles`), Girlmates (`girlmate_profiles`, `girlmate_messages`), verification storage, IRL (`gatherings`, `seat_reservations`), Safety (`blocks`, reports, `moderation_cases`), `moments` (private) |
| **P1** | Connect (`bloom_requests`, `introductions`), Club memberships, `community_posts` (until frozen), `come_with_me_joins` |
| **P2** | Commerce, hanger, city trending, legacy `events` |

See consolidation review for per-table checks.

---

## What belongs in `lib/` vs `app/components/`

| Layer | Organize by |
|-------|-------------|
| `lib/{domain}/` | Business logic, search, truth writes, Yande, notifications |
| `app/components/{domain}/` | UI for member features |
| `app/api/` | Route handlers — thin; call `lib/` |

**Rule:** New code goes in the domain folder, not loose `lib/utils-*.ts` unless truly cross-cutting.

---

## Anti-patterns (do not do)

- Describing gatherings as a fourth nav pillar or peer cross-cutting “IRL object” (they live in **Happenings**; City/Clubs link/surface only)
- Describing Wall Posts as personal activity / "what I'm doing" updates
- New report table without Safety domain review
- New `events` writes
- New SMS send outside `notification-service`
- New public bucket for government IDs
- Polymorphic `content` table "to simplify everything"
