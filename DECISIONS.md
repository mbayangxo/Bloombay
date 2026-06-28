# BloomBay Architecture Decisions

> **Don’t build more systems. Finish defining the systems you already have.**

> **Rules, not discussions.** One line per decision. Update when the founder approves a change — never fork parallel systems silently.

**Last updated:** 2026-06-25 (Knowledge domain; product pillars)  
**Review with:** `DOMAIN_BOUNDARIES.md`, `DATABASE_ARCHITECTURE.md`, ChatGPT + Cursor review sessions

**Workflow:** Product questions get **grounded** in schema/code before anyone writes features. You define → ChatGPT pressure-tests → Cursor verifies → Claude implements only after a decision lands here.

---

## How to use this file

Before any new table, API, or feature:

1. Which **domain** owns this? (`DOMAIN_BOUNDARIES.md`)
2. Which **existing table** is canonical?
3. If creating something new — **why can't an existing table be extended?**

If you can't answer all three, stop and review.

---

## IRL

| Decision | Status |
|----------|--------|
| **`gatherings`** is the canonical IRL event table | ✅ Active |
| **`events`** is legacy — no new writes | ✅ Freeze |
| UI may say Happenings/Events; code says `gatherings` | ✅ Rule |
| **`bloomies_plans`** stays separate from gatherings (personal commitments, not public calendar) | ✅ Active |

---

## Connect (one product, multiple layers)

| Layer | Canonical table | Job |
|-------|-----------------|-----|
| Introductions | `introductions` | "Here's who I am." (discovery profile) |
| Come With Me | `come_with_me_posts` + `come_with_me_joins` | "I'm going somewhere." (ephemeral, ~7 days) |
| Bloom Request | `bloom_requests` | "Let's connect." (1:1 opt-in) |
| Friendship health | `friendship_scores` | Yande read model — not user-facing schema |

**Rule:** Unify in **UI** under Connect; do **not** merge tables before beta.

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
| **Gatherings** | `gatherings` | IRL events (see IRL section) |
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
| **One canonical member-to-member report pipeline** — P0 before launch | 🔴 TODO |
| Today: `user_reports` (API) + `member_reports` (Yande cron) + `safety_reports` (support form) — consolidate writes | 🔴 TODO |
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
| `yande_memory`, `yande_memories`, `memory_events` — document & deprecate stubs; no new writes without owner | 🟡 TODO |
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
| 2026-06-25 | Gatherings canonical; events legacy freeze |
| 2026-06-25 | Avenue = rooms + culture; Wall Posts = Avenue conversation layer (not personal updates) |
| 2026-06-25 | Bloom Notes = Knowledge domain (own product; shared infra only) |
| 2026-06-25 | Connect = one product, four layers, separate tables |
| 2026-06-25 | Reports consolidation P0 before launch |
| 2026-06-25 | community_posts frozen |
