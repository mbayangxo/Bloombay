# BloomBay Supabase Schema Reference

> Generated from `supabase/migrations/` on branch `claude/mobile-fixes-screenshots-AV7Xm`  
> **122 migration files** · Run in SQL Editor in sorted filename order unless using batch bundles

For architecture context see `DATABASE_ARCHITECTURE.md`.

---

## Enum: `user_role`

`member` · `founder` · `admin` · `club_owner` · `partner` · `moderator` · `curator`

---

## Core tables

### `profiles`
| Column (key) | Type | Notes |
|--------------|------|-------|
| `id` | uuid PK | FK → `auth.users` |
| `email` | text | |
| `full_name` | text | |
| `phone` | text | 004, 008 |
| `role` | user_role | default `member` |
| `city`, `neighborhood`, `state` | text | |
| `verified` | boolean | gates happenings/intros |
| `trust_score`, `attendance_score`, `community_score` | int | |
| `home_photo_url` | text | private home screen photo |
| `is_founding_member` | boolean | 087 |
| Social handles | text | 070 |

### `waitlist`
Pre-launch signups; public insert policy.

---

## IRL & gatherings

### `gatherings`
| Column (key) | Notes |
|--------------|-------|
| `slug` | unique |
| `title`, `starts_at`, `area` | |
| `capacity`, `spots_left` | |
| `club_slug` | optional club link |
| `event_type`, `image_url`, `description` | 018 |
| `venue`, `neighborhood` | 006 |
| `event_key` | prototype id bridge (g1, g2) |
| `created_by` | host member uuid |
| Curated / Eventbrite cols | 057 |

### `seat_reservations`
`gathering_id`, `user_id`, `status` (`reserved` | `cancelled`)

### `gathering_attendance`
Check-in truth; one row per user per gathering.

### `gathering_witnesses`
Social proof after events.

### `club_memberships`
`user_id`, `club_slug` — member joined club.

### `club_applications`
Apply-to-join curated clubs; status workflow.

---

## Truth layer (006)

| Table | Purpose |
|-------|---------|
| `bloom_requests` | Connect / intro requests (`pending` \| `accepted` \| `declined`) |
| `member_calendar_plans` | Girl calendar entries |
| `member_stamps` | IRL stamp book |
| `member_preferences` | Mood, vibes, availability (064–065) |
| `member_behavior_signals` | Yande raw signals (`signal_type`, `payload` jsonb) |

---

## Clubs

### `clubs`
Branding & studio fields from 013–021, 066:

- `slug`, `name`, `owner_id`
- `cover_url`, `banner_url`, `logo_url`
- `tagline`, `description`, `welcome_line`
- `primary_color`, `accent_color`
- `crest_symbol`, `layout_key`, `logo_template`, `brand_display_mode`
- `is_paid`, `price_cents`, `member_limit`
- `album_urls` (jsonb), `welcome_video_url`, `welcome_audio_url`
- `landing_copy`, `inside_copy`

### Related
`club_posts`, `club_traditions`, `club_broadcasts`, `broadcast_poll_responses`, `broadcast_replies`, `club_customization`, `club_media`, `patch_orders`

---

## Introductions & social graph

| Table | Purpose |
|-------|---------|
| `introductions` | V2 intro flow (060) |
| `introduction_flowers` | Appreciation on intros |
| `come_with_me_posts` / `come_with_me_joins` | Bring-a-friend |
| `friendship_scores` | Health of friendships |
| `friend_scans` | QR friend connections |
| `bloom_scan_streaks` | Streak gamification |

---

## Content & wall

| Table | Purpose |
|-------|---------|
| `wall_posts`, `wall_post_blooms` | Member wall |
| `bloom_notes`, `bloom_note_flowers`, `bloom_note_saves`, `bloom_note_tags` | Notes feed |
| `moments` | Memory posts (088) |
| `fashion_posts` | Fashion content (084) |
| `community_posts` | Community board (007) |
| `avenue_content`, `avenue_content_saves` | Avenue rooms |
| `magazine_pitches`, `editor_instructions` | Editorial AI |
| `post_comments`, `post_flowers`, `comment_flowers` | Threading + flowers |
| `city_trending`, `city_trending_saves` | City trends |

---

## Messaging & notifications

| Table | Purpose |
|-------|---------|
| `conversations`, `conversation_participants`, `direct_messages` | DMs |
| `notifications` | In-app (029) |
| `notification_events`, `notification_preferences` | Event-driven (113) |
| `member_mailbox_messages` | Mailbox (011) |
| `girlmate_messages` | GirlMate DMs |
| `hanger_messages` | Marketplace chat |

---

## Commerce

| Table | Purpose |
|-------|---------|
| `hanger_listings`, `hanger_sales` | The Hanger marketplace |
| `hanger_reviews`, `hanger_flowers`, `hanger_comments` | Social proof |
| `book_listings`, `book_requests` | Book swap |
| `bloom_drops`, `drop_claims` | Partner drops |
| `purchases`, `pending_orders`, `tickets` | Payments (054, 108) |
| `payment_audit_logs` | Audit trail |
| `table_reservations` | Restaurant tables (056) |

---

## Planner & trips

| Table | Purpose |
|-------|---------|
| `bloomies_plans`, `bloomies_plan_invites`, `bloomies_plan_messages` | Group plans |
| `bloom_trips`, `bloom_trip_attendees` | Trips |
| `bloom_bouquet` | Bouquet feature |
| `traditions`, `tradition_followers` | Traditions feed |
| `wellness_posts`, `wellness_saves` | Wellness |

---

## Flowers & pins

| Table | Purpose |
|-------|---------|
| `gathering_flowers`, `profile_flowers` | Event/profile flowers |
| `bloom_flowers`, `member_milestones` | Milestones (074) |
| `pin_drops`, `pin_drop_joins`, `pin_drop_recipients` | Pin drops |
| `safety_pings` | Safety check-ins |

---

## Yande stack

| Table | Migration | Purpose |
|-------|-----------|---------|
| `yande_memory` | 007 | Early memory stub |
| `yande_memories` | 049 | Memory snippets |
| `yande_actions` | 059 | Agent actions |
| `yande_member_touches` | 059 | Touch audit |
| `yande_signals` | 083 | Learning signals |
| `yande_user_context` | 100 | Per-user context |
| `yande_drafts`, `yande_action_log` | 099 | Drafts + log |
| `member_memory_graph` | 062 | Memory graph |
| `memory_events` | 062–063 | Timeline (+ triggers) |
| `yande_messages` | 062 | Messages |
| `yande_scientist_reports` | 062 | Reports |
| `yande_questions` | 076 | Q&A cards |
| `member_question_responses` | 076 | Answers |
| `yande_match_outcomes` | 083 | Match learning |
| `yande_compat_weights` | 083 | Weights |
| `yande_match_queue` | 083 | Queue |

---

## Events (legacy parallel)

| Table | Notes |
|-------|-------|
| `events`, `event_attendees` | 006_events — prefer `gatherings` for member portal |
| `event_waitlist`, `event_witnesses`, `host_reviews` | 031 |
| `event_memories`, `gathering_photos` | 061 |
| `event_checkins` | 041 |
| `event_audit_log` | 105 |

---

## GirlMate

| Table | Purpose |
|-------|---------|
| `girlmate_profiles` | Listings |
| `girlmate_partner_applications` | Partner apply |
| Standalone auth | 051 |

---

## Founder & ops

| Table | Purpose |
|-------|---------|
| `careers_applications` | Hiring |
| `member_applications` | Member apply (046) |
| `founder_analyst_reports` | 048 |
| `founder_brand_interviews`, `founder_brand_profile` | 075 |
| `founding_chat_messages`, `weekly_prompts` | 058 |
| `club_mama_applications` | Club Mama apply |
| `content_moderation` | Queue (097) |
| `user_feedback`, `site_health_reports` | QA (052) |
| `cron_logs` | Cron audit (101, 114) |
| `upload_audit_logs` | Storage audit (111) |
| `message_templates` | Editable templates (012) |

---

## Safety

| Table | Purpose |
|-------|---------|
| `safety_reports` | 007 |
| `member_reports`, `support_tickets` | 060 |
| `user_blocks`, `user_reports` | 103 |

---

## Media

| Table | Purpose |
|-------|---------|
| `profile_photos` | Gallery (002) |
| `member_memories` | Scrapbook photos (013) |

---

## Key relationships (ER sketch)

```
auth.users 1──1 profiles
profiles 1──* seat_reservations ──* gatherings
profiles 1──* gathering_attendance ──* gatherings
profiles 1──* club_memberships (club_slug)
profiles 1──* member_behavior_signals
profiles 1──* bloom_requests (from/to)
gatherings *──1 clubs (club_slug → clubs.slug)
clubs 1──* club_applications
```

---

## Migration index (by number)

| Range | Theme |
|-------|-------|
| 000–005 | Waitlist, profiles, early clubs |
| 006–010 | IRL core, truth layer, events, community |
| 011–019 | Mailbox, templates, media, club studio |
| 024–029 | Backfill, traditions, partners, DMs, notifications |
| 030–041 | Bloom notes, GirlMate, hanger, book, trips, wellness, bouquet |
| 042–056 | GirlMate ext, avenue, launch blockers, pin drops, reservations |
| 057–071 | Curated gatherings, founding mothers, Yande actions, intros, broadcasts |
| 062–083 | Memory agents, preferences, Yande learning |
| 084–096 | Fashion, hanger social, drops, magazine |
| 097–114 | Moderation, payments, indexes, notifications v2, storage |

Duplicate numbers (e.g. two `006_*`) — read file headers; `003_irl_core.sql` is canonical for gatherings.

---

## Applying schema

```bash
# Minimal bootstrap
# Run supabase/apply-all.sql then migrations 003, 006, … in order

# Or full history in Supabase SQL Editor (staging first)
```

See `docs/SETUP.md` and `scripts/db-setup.mjs`.
