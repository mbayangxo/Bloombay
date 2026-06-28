# BloomBay Database Architecture

> PostgreSQL via **Supabase** · migrations in `supabase/migrations/` · bootstrap in `supabase/apply-all.sql`  
> **Companion:** `DATABASE_PRINCIPLES.md` · `MIGRATION_APPLY_ORDER.md` · `DECISIONS.md` · `DOMAIN_BOUNDARIES.md`

**Last updated:** 2026-06-08 (Phase A — canonical map, P0 guardrails)

---

## Design principles

1. **Supabase Auth** owns identity (`auth.users`); **`public.profiles`** extends every user with role and member fields.
2. **Phase 1 truth layer** (`006_member_truth_layer.sql`): member actions write to Postgres first; UI caches are mirrors (`lib/truth/client.ts`).
3. **RLS everywhere** on member-facing tables; cron/admin uses **service role** only when batch jobs need cross-user reads.
4. **Product semantics drive schema** — not table-name similarity. See `DATABASE_PRINCIPLES.md`.
5. **Migrations are incremental** — **127 SQL files**; duplicate numeric prefixes exist. **Do not rely on filename sort alone.** Use `MIGRATION_APPLY_ORDER.md`.

---

## Canonical table map (by domain)

### Identity & access

| Table | Status | Job |
|-------|--------|-----|
| `profiles` | ✅ Canonical | Role, verification, city, member fields |
| `waitlist`, `member_applications`, `careers_applications` | ✅ Active | Pre-member pipeline |
| `user_blocks` | ✅ Active | Block enforcement (103) |

### Happenings / IRL (gatherings)

| Table | Status | Job |
|-------|--------|-----|
| **`gatherings`** | ✅ **Canonical** | BloomBay events — product home is **Happenings** |
| `seat_reservations` | ✅ Active | RSVP truth |
| `gathering_attendance` | ✅ Active | Check-in truth |
| `gathering_witnesses` | ✅ Active | Social proof |
| `club_memberships`, `club_applications` | ✅ Active | Club ↔ member |
| **`events`** | ❌ **Frozen** | Legacy — **no new writes**; migrate reads to `gatherings` |

```
gatherings → seat_reservations → gathering_attendance
           → gathering_witnesses
club_memberships ← club_applications
```

**Guardrail:** All IRL/event writes go to `gatherings`. UI says Happenings; database says `gatherings`.

### Content (separate by product meaning — do not merge pre-beta)

| Table | Status | Product meaning |
|-------|--------|-----------------|
| `wall_posts` | ✅ Active | Avenue **conversation** (prompts, discussion) |
| `avenue_content` | ✅ Active | Avenue **editorial** rooms |
| `fashion_posts` | ✅ Active | Fashion Avenue room |
| `bloom_notes` | ✅ Active | **Place knowledge** (Knowledge domain) |
| `moments` | ✅ Active | **Private** Lounge memory |
| `community_posts` | ❌ **Frozen** | No new features, no new writes |
| `post_comments`, `post_flowers`, `comment_flowers` | ✅ Shared infra | Comments/reactions across surfaces |

### Connect / Introductions

| Table | Status | Job |
|-------|--------|-----|
| `introductions`, `introduction_flowers` | ✅ Active | Discovery profiles — surfaced **contextually** |
| `bloom_requests` | ✅ Active | 1:1 opt-in connect |
| `come_with_me_posts`, `come_with_me_joins` | ✅ Active | Ephemeral “going somewhere” |
| `friendship_scores` | ✅ Active | Yande read model |

### Clubs

| Table | Status |
|-------|--------|
| `clubs`, `club_applications`, `club_memberships` | ✅ Active |
| `club_posts`, `club_traditions`, `club_broadcasts` | ✅ Active |
| `club_customization`, `club_media`, `patch_orders` | ✅ Active |

### Plans

| Table | Status | Job |
|-------|--------|-----|
| `bloomies_plans` | ✅ Active | Personal/small-group coordination — **not** public calendar |

### Messaging

| Table | Status | Job |
|-------|--------|-----|
| `conversations`, `direct_messages` | ✅ Canonical (general DMs) | |
| `girlmate_messages` | ✅ Active (beta) | Isolated — post-beta migrate to `conversations` |
| `hanger_messages` | ✅ Active | Marketplace messages |
| `notifications`, `member_mailbox_messages` | ✅ Active | |
| `notification_events`, `notification_preferences` | ✅ Active (113+) | |

### Commerce

| Table | Status |
|-------|--------|
| `pending_orders`, `tickets`, `purchases` | ✅ Active |
| `bloom_drops`, `drop_claims` | ✅ Active |
| `hanger_listings`, `hanger_sales`, `hanger_reviews` | ✅ Active |

### Yande & memory

| Table | Status | Role |
|-------|--------|------|
| **`member_behavior_signals`** | ✅ **Canonical write** | Raw behavior log |
| **`yande_user_context`** | ✅ **Canonical read** | Aggregated context for Yande |
| `member_preferences` | ✅ Active | Explicit member prefs |
| `yande_signals`, `yande_actions` | ✅ Active | Structured signals/actions |
| `yande_match_outcomes`, `yande_compat_weights`, `yande_match_queue` | ✅ Active | Matching pipeline |
| `yande_questions`, `member_question_responses` | ✅ Active | Onboarding games |
| `member_memory_graph`, `memory_events`, `yande_messages` | 🟡 Stub/legacy | **No new writes** without policy |
| `yande_memory`, `yande_memories` (100) | 🟡 Review | See pending **`YANDE_MEMORY_POLICY.md`** |

**Guardrail:** No new Yande memory tables before `YANDE_MEMORY_POLICY.md` is approved. Extend `member_behavior_signals` + `yande_user_context` first.

### Safety & reports — 🔴 P0 before private beta

| Table | Status | Job |
|-------|--------|-----|
| **`member_reports`** | ✅ Active (060) | Member-to-member reports — **target canonical write** |
| `user_reports` | 🟡 Legacy overlap | Created 103 — dual-write mirror today |
| `safety_reports` | ✅ Active | **Separate job** — account/contact safety form, not M2M reports |
| `content_moderation` | ✅ Active (097) | Content review queue |
| `moderation_cases` | ✅ Active (115) | Human moderation queue |
| `admin_audit_logs` | ✅ Active (115, 118) | Founder/admin action audit |
| `safety_pings` | ✅ Active | Safety monitoring |

**P0 — reports consolidation (design before migration):**

1. One canonical write path for member-to-member reports (likely `member_reports` — Yande safety + moderation already read it).
2. Remove dual-write mirror in `/api/member/report` (`user_reports` + `member_reports`).
3. Keep `safety_reports` for a different product surface.
4. Route all moderation reads to one table + `moderation_cases`.

See `DECISIONS.md` · Phase B after design review.

### Ops

| Table | Status |
|-------|--------|
| `cron_logs` | ✅ Active |
| `event_audit_log`, `upload_audit_logs` | ✅ Active |

---

## Product → table quick reference

| Product says | Database says |
|--------------|---------------|
| Happenings | `gatherings` (+ seats, attendance) |
| Gathering | `gatherings` row |
| Event (legacy) | `events` — frozen |
| Wall | `wall_posts` |
| Bloom Note | `bloom_notes` |
| Moment | `moments` |
| Avenue editorial | `avenue_content` |
| Introduction | `introductions` |
| Report a member | `member_reports` (target canonical) |

---

## Storage buckets

Defined in `013_member_media.sql`, `014_storage_buckets.sql`, `111_storage_hardening.sql`, `117_storage_hardening.sql`:

- `club-media` — club covers, welcome media
- Profile / member media buckets
- **`government-ids`**, **`verification-selfies`** — private only, signed URLs (112, 117)

**P0 RLS tables:** `profiles`, report tables, `girlmate_messages`, `direct_messages`, gov-ID buckets, `moderation_cases`.

---

## RLS patterns

| Pattern | Example |
|---------|---------|
| Read/update own profile | `profiles`: `auth.uid() = id` |
| Insert own truth rows | `member_behavior_signals`: `user_id = auth.uid()` |
| Public read clubs/gatherings | `clubs`, `gatherings` select for authenticated |
| Ops read-all | founder/admin policies (004, 115) |
| No role self-escalation | `107_auth_hardening.sql` |
| Restricted profile visibility | `102_profile_privacy.sql` |

---

## Indexes & scale

- `109_database_indexes.sql`, `110_supplemental_indexes.sql`, `110_search_filter_indexes.sql`

---

## Migration bootstrap

| File | Role |
|------|------|
| `supabase/apply-all.sql` | Minimal bootstrap: waitlist, profiles, trigger |
| `003_irl_core.sql` | **IRL core**: `gatherings`, seats, attendance |
| `006_member_truth_layer.sql` | Truth layer: bloom_requests, stamps, `member_behavior_signals` |
| `CATCHUP_missing_tables.sql` | Idempotent catch-up 030–056 |
| `RUN_ALL_030_to_056.sql` | Batch bundle alternative |
| `115`–`118` | Admin moderation, notifications, storage, audit |

**Full ordered apply list:** `MIGRATION_APPLY_ORDER.md` (not `docs/SETUP.md` alone — that file stops at 007).

---

## What we will not do (founder rules)

- ❌ No big-bang content table merge before beta
- ❌ No new `events` writes
- ❌ No new report tables — consolidate existing ones
- ❌ No new Yande memory tables before `YANDE_MEMORY_POLICY.md`
- ❌ No schema redesign for cleanliness
- ❌ No `*_v2` tables — extend canonical tables

---

## Local setup

1. Follow **`MIGRATION_APPLY_ORDER.md`** for fresh or staging projects.
2. Set `SUPABASE_SERVICE_ROLE_KEY` for founder seed / cron.
3. Apply pending **115–118** on production if not already applied.

See `docs/SETUP.md` for env vars and auth setup.
