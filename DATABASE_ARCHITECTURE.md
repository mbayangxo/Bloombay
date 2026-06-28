# BloomBay Database Architecture

> PostgreSQL via **Supabase** · migrations in `supabase/migrations/` · bootstrap in `supabase/apply-all.sql`

---

## Design principles

1. **Supabase Auth** owns identity (`auth.users`); **`public.profiles`** extends every user with role and member fields.
2. **Phase 1 truth layer** (`006_member_truth_layer.sql`): member actions write to Postgres first; UI caches are mirrors (`lib/truth/client.ts`).
3. **RLS everywhere** on member-facing tables; cron/admin uses **service role** when batch jobs need cross-user reads.
4. **Gatherings are canonical** for IRL events (`public.gatherings`); legacy `events` table exists from early migrations — prefer `gatherings` for member portal.
5. Migrations are **incremental**; some numeric prefixes repeat (e.g. two `003_*`) — run in filename sort order or follow `docs/SETUP.md`.

---

## Migration bootstrap

| File | Role |
|------|------|
| `supabase/apply-all.sql` | Minimal: waitlist, `user_role` enum, `profiles`, `handle_new_user()` trigger |
| `000_waitlist_table.sql` | Waitlist + anon insert policy |
| `002_profiles_auth.sql` | Full profiles + role enum + RLS |
| `003_irl_core.sql` | **IRL core**: gatherings, seats, attendance, club_memberships |
| `006_member_truth_layer.sql` | **Truth layer**: bloom_requests, calendar, stamps, witnesses, `member_behavior_signals` |
| `107_auth_hardening.sql` | Prevent self role escalation on profiles |
| `108_payment_hardening.sql` | `pending_orders`, `tickets`, payment audit |
| `CATCHUP_missing_tables.sql` | Idempotent catch-up for 030–056 |
| `RUN_ALL_030_to_056.sql` | Batch bundle (bloom_notes → table_reservations) |

Full table list: see `SUPABASE_SCHEMA.md`.

---

## Domain map

### Identity & access

- `profiles` — role, verification, city, trust scores, social handles
- `waitlist`, `member_applications`, `careers_applications`
- `user_blocks`, `user_reports` (103)

### IRL loop (core product)

```
gatherings → seat_reservations → gathering_attendance
            → gathering_witnesses
club_memberships ← club_applications
```

- `gatherings` — slug, title, starts_at, capacity, spots_left, club_slug, event_type, image_url, created_by
- `seat_reservations` — reserved/cancelled per user per gathering
- `gathering_attendance` — check-in truth
- `club_memberships` — member ↔ club slug

### Social & content

- `wall_posts`, `bloom_notes`, `moments`, `community_posts`
- `avenue_content`, `magazine_pitches`, `city_trending`
- `post_comments`, `post_flowers`, `comment_flowers`

### Introductions & matching

- `bloom_requests` — opt-in connect requests (006)
- `introductions`, `introduction_flowers` (060)
- `come_with_me_posts`, `come_with_me_joins` (069)
- `friendship_scores` (050)

### Clubs & Club Mama

- `clubs` — branding, layout, crest, album_urls (013–021, 066)
- `club_applications`, `club_posts`, `club_traditions`, `club_broadcasts`
- `club_customization`, `club_media`, `patch_orders`

### Commerce

- `hanger_listings`, `hanger_sales`, `hanger_messages`, `hanger_reviews`
- `bloom_drops`, `drop_claims`, `purchases`, `pending_orders`, `tickets`
- `book_listings`, `book_requests`

### Yande & memory

- `member_behavior_signals` — raw event log (006)
- `member_preferences` — explicit prefs (064–065)
- `yande_signals`, `yande_user_context`, `yande_actions` (059, 083, 099, 100)
- `member_memory_graph`, `memory_events`, `yande_messages` (062–063)
- `yande_questions`, `member_question_responses` (076–077)
- `yande_match_outcomes`, `yande_compat_weights`, `yande_match_queue` (083)

### Ops & safety

- `safety_reports`, `safety_pings`, `content_moderation`
- `notification_events`, `notification_preferences` (113)
- `cron_logs`, `event_audit_log`, `upload_audit_logs`

### Messaging

- `conversations`, `conversation_participants`, `direct_messages`
- `notifications`, `member_mailbox_messages`
- `girlmate_messages`

---

## Storage buckets

Defined in `013_member_media.sql`, `014_storage_buckets.sql`, `111_storage_hardening.sql`:

- `club-media` — club covers, welcome video/audio
- Profile / member memories buckets (see migration comments)
- Verification uploads (with cleanup policy 112)

---

## RLS patterns

| Pattern | Example |
|---------|---------|
| Read/update own profile | `profiles`: `auth.uid() = id` |
| Insert own truth rows | `member_behavior_signals`: `user_id = auth.uid()` |
| Public read clubs/gatherings | `clubs`, `gatherings` select for authenticated or all |
| Ops read-all | founder/admin policies on `profiles` (004) |
| No role self-escalation | `107_auth_hardening.sql` — update limited columns |
| Restricted profile visibility | `102_profile_privacy.sql` |

---

## Indexes & scale

- `109_database_indexes.sql`, `110_supplemental_indexes.sql` — hot paths for feeds, notifications, Yande

---

## Local setup

1. Run migrations in Supabase SQL Editor (order matters).
2. Or `node scripts/db-setup.mjs` where supported.
3. Set `SUPABASE_SERVICE_ROLE_KEY` for founder seed / cron.

See `docs/SETUP.md` for step-by-step.
