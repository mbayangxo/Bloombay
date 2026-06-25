# BloomBay Dependency Map

> High-level architecture & import graph for `girlfrnds-prototype`  
> Companion to `FILE_TREE.md` · Sources: codebase grep, existing `*_ARCHITECTURE.md` docs

---

## System overview

```
Browser
  → proxy.ts (Supabase session, role gates, legacy redirects)
  → App Router page (RSC and/or Client Component)
       → app/components/portal/* (member UI)
       → lib/* (business logic, stores, types)
            → lib/truth/client.ts → fetch('/api/...')  [Phase 1 member actions]
            → lib/supabase/{server,client,admin}       [direct DB in RSC/actions]
  → app/api/**/route.ts
       → lib/auth/require-role.ts
       → lib/supabase/server | lib/supabase/admin | lib/supabase-admin
       → lib/truth/behavior.ts, lib/yande/*
  → Supabase PostgreSQL (RLS) + Storage buckets

Cron (Vercel) → app/api/cron/* → service role client → lib/yande/* agents
Webhooks → Stripe / Whop → app/api/payments/*, app/api/whop/*
```

---

## Portal connections

Five production login surfaces (+ GirlMate). Routing enforced in `proxy.ts` via `ROLE_PORTAL` and protected path prefixes.

| Portal | Login | Role(s) | App prefix | Layout / shell |
|--------|-------|---------|------------|----------------|
| **Member** | `/member/login` | `member` | `/member/*` | `(member-portal)/layout.tsx` → `MemberPortalShell` |
| **Clubhouse** | `/club-owner/login` | `club_owner` | `/club-owner/*` | `club-owner/(authenticated)/layout.tsx` → `club-owner-shell` |
| **Partner** | `/partner/login` | `partner` | `/partner/*` | `(partner-portal)/layout.tsx` |
| **Founder** | `/founder/login` | `founder` | `/founder/*` | `founder/(portal)/layout.tsx` → Mission Control |
| **Admin/Ops** | `/admin/login` | `admin`, `moderator` | `/admin/*` | `admin/(ops)/layout.tsx` |
| **Curator** | `/admin/login` (redirect from `/curator/login`) | `curator` | `/curator/*` | `curator/(portal)/layout.tsx` |
| **GirlMate** | `/girlmate/login` | GirlMate accounts | `/girlmate/*` | `girlmate/layout.tsx` |
| **Company staff** | `/company` | founder, admin, club_owner, partner, curator | Redirects to role portal | `app/components/auth/` |

**Cross-portal shared UI**

| Component area | Portals |
|----------------|---------|
| `app/components/club/` | Member club interior + Clubhouse |
| `app/components/admin/` | Founder + Admin ops |
| `app/components/auth/` | All login flows |
| `app/components/partner-brand/` | Partner + member partner storefronts |

**Dev-only:** `app/_cursor-member/` mirrors member routes — not in production nav.

---

## `lib/` → app area imports (high-level)

Counts are files importing `@/lib/*` (not total import statements).

| App area | Files importing `lib/` | Primary `lib/` domains |
|----------|------------------------|------------------------|
| `app/components/portal/` | ~95 | `plans/`, `auth/`, `clubs/`, `happenings/`, `truth/`, `theme/`, `portal-onboarding/`, root `member-*-data`, `yande-*` |
| `app/club-owner/` | ~45 | `club-owner-store`, `club-owner-hub`, `club-owner-data`, `auth/`, `payments/`, `storage/` |
| `app/(member-portal)/` pages | ~26 | Thin pages → delegate to `portal/` components; direct: `auth/get-user`, `plans/get-plans-data` |
| `app/founder/` | ~12 | `mission-control-data`, `founder-dashboard-metrics`, `submissions-queues`, `careers-admin`, `auth/get-mc-role` |
| `app/admin/` | ~7 | `admin-auth`, `waitlist-admin`, `mission-control-data`, `auth/` |
| `app/api/member/` | 49 routes | `supabase/server`, `auth/get-user`, `truth/behavior`, `truth/resolve-gathering` |
| `app/api/cron/` | 19 routes | `cron-guard`, `yande/*` (messages, operations, scheduling, post-event, memory-keeper) |
| `app/api/club-portal/` | 5 routes | `supabase/server`, club gathering helpers |
| `app/api/irl/` | 5 routes | `supabase/server`, `truth/behavior`, `truth/resolve-gathering` |

### Member portal — typical lib paths by feature

| Feature | `lib/` modules | Data path |
|---------|----------------|-----------|
| Home board | `use-home-mockup-data` hook → `/api/clubs`, `/api/home/glance` | Supabase + API |
| Happenings / RSVP | `event-rsvp-store`, `gatherings-feed`, `truth/client` | Truth APIs → `gatherings`, `seat_reservations` |
| Plans room | `plans/types`, `plans/mock-data`, `plans/get-plans-data` | Mixed: UI mock + `/api/member/plans` |
| Clubs | `clubs/types`, `clubs/fetch-clubs`, `clubs/mock-data` | `/api/clubs`, `/api/member/club-applications` |
| Calendar | `member-calendar-store`, `truth/client` | `/api/member/calendar` → `member_calendar_plans` |
| Mood / discovery | `discovery-mood-store`, `truth/client` | `/api/member/preferences` |
| Profile | `auth/actions`, `storage/upload`, `supabase/client` | `/api/member/profile`, Storage |
| Onboarding tour | `portal-onboarding/store` | localStorage + optional Supabase |
| Avenue / magazine | `avenue/*`, `magazine-room/store` | `/api/avenue/*` → `avenue_content` |

### Club owner — typical lib paths

| Feature | `lib/` modules | API |
|---------|----------------|-----|
| Dashboard | `club-owner-store`, `club-owner-data`, `portal-dashboard-data` | `/api/club-portal/my-club` |
| Gatherings | `actions/happenings`, `bloombay-events-store` | `/api/club-portal/gatherings` |
| Members / apps | `club-owner-hub` | `/api/club-portal/members`, `applications` |
| Branding | `storage/upload`, `crest-system` | `/api/club-owner/branding`, `/api/clubs/[id]/media` |
| Payments | `payments/stripe` | `/api/payments/stripe/*` |

### Founder / admin — typical lib paths

| Feature | `lib/` modules | API |
|---------|----------------|-----|
| Mission Control KPIs | `mission-control-data`, `founder-dashboard-metrics`, `irl/founder-metrics` | `/api/admin/stats`, `live-stats`, `quick-stats` |
| Submissions | `submissions-queues`, `waitlist-admin`, `supabase-admin` | `/api/admin/submissions` |
| Moderation | `admin-auth` | `/api/founder/moderation` |
| Careers | `careers-admin` (+ `SEED_CAREER_APPLICATIONS` fallback) | `/api/careers/*` |
| Yande ops | `yande/*` via admin UI | `/api/yande/*`, `/api/cron/yande-*` |

---

## API route domains → `lib/` + Supabase tables

### Phase 1 truth / IRL (`app/api/irl/`, key `member/` routes)

| API | `lib/` | Tables |
|-----|--------|--------|
| `POST /api/irl/reserve` | `truth/behavior`, `truth/resolve-gathering` | `gatherings`, `seat_reservations`, `member_behavior_signals` |
| `POST /api/irl/check-in` | `truth/behavior` | `gathering_attendance`, `member_stamps`, `bloom_scan_streaks` |
| `POST /api/irl/join-club` | — | `club_memberships` |
| `POST /api/member/bloom-requests` | `truth/behavior` | `bloom_requests` |
| `POST /api/member/witnesses` | `truth/behavior`, `truth/resolve-gathering` | `gathering_witnesses` |
| `POST /api/member/stamps` | `truth/behavior` | `member_stamps` |
| `GET/POST /api/member/calendar` | — | `member_calendar_plans` |
| `POST /api/member/preferences` | — | `member_preferences` |
| `POST /api/member/behavior` | `truth/behavior` | `member_behavior_signals` |

Client entry point: `lib/truth/client.ts` → POST/GET to above routes. Used by `member-calendar-store`, `event-rsvp-store`, `discovery-mood-store`.

### Clubs & Clubhouse

| API | Tables |
|-----|--------|
| `GET /api/clubs`, `/api/clubs/[slug]` | `clubs` |
| `GET/POST /api/clubs/[id]/customization`, `media`, `patch-order` | `club_customization`, `club_media`, `patch_orders` |
| `/api/club-portal/*` | `clubs`, `gatherings`, `club_memberships`, `club_applications`, `club_broadcasts` |
| `/api/club-owner/branding` | `clubs` (branding columns) |

### Social & content

| API | Tables |
|-----|--------|
| `/api/wall/*`, `/api/comments`, `/api/flowers` | `wall_posts`, `post_comments`, `post_flowers`, `comment_flowers` |
| `/api/member/community-posts`, `pin-drops`, `bouquet`, `flowers` | `community_posts`, pin/bouquet tables |
| `/api/moments/post` | `moments` |
| `/api/avenue/*` | `avenue_content`, `magazine_pitches` |
| `/api/introductions`, `/api/come-with-me` | `introductions`, `come_with_me_posts` |

### Commerce

| API | `lib/` | External |
|-----|--------|----------|
| `/api/payments/stripe/checkout`, `webhook`, `refund` | `payments/stripe` | **Stripe** |
| `/api/hanger/checkout`, `/api/shop/checkout` | `payments/stripe` | **Stripe** |
| `/api/whop/checkout`, `webhook` | `whop.ts` | **Whop** (legacy) |
| `/api/drops/*` | — | `bloom_drops`, `drop_claims` |

### Yande & cron

| API / cron | `lib/` | Tables |
|------------|--------|--------|
| `/api/yande/signal`, `memory`, `context`, `learn`, `support` | `yande/core`, `yande-memory` | `yande_signals`, `yande_user_context`, `member_behavior_signals` |
| `/api/cron/yande-host`, `yande-messages`, `yande-community`, `yande-scientist` | `yande/messages`, `yande/matching`, etc. | `yande_actions`, `yande_messages`, `cron_logs` |
| `/api/cron/memory-keeper`, `memory-layer` | `yande/memory-keeper` | `member_memory_graph`, `memory_events` |
| `/api/cron/safety-monitor` | `yande/safety` | `safety_reports`, `safety_pings` |
| `/api/cron/city-intelligence` | city helpers | `city_trending` + external APIs |
| `/api/cron/avenue-editors` | `avenue/*`, Anthropic | `avenue_content` |
| All crons | `cron-guard` | `cron_logs` |

### Admin / founder ops

| API | `lib/` | Tables |
|-----|--------|--------|
| `/api/admin/stats`, `live-stats`, `quick-stats` | `admin-auth`, `mission-control-data` | `profiles`, `gatherings`, aggregates |
| `/api/admin/submissions`, `approve-member` | `supabase-admin`, `waitlist-admin` | `waitlist`, `member_applications`, `profiles` |
| `/api/admin/verification-photo` | `supabase/admin` | `profiles` (verification fields) |
| `/api/founder/moderation` | `auth/get-user` | `content_moderation` |
| `/api/founder/create/generate` | `founder-create-space/*`, Anthropic | — (AI output) |
| `/api/careers/*` | `careers-admin`, `supabase-admin` | `careers_applications` |

### Comms

| API | `lib/` | External |
|-----|--------|----------|
| `/api/sms/send`, `/api/admin/waitlist/notify` | `notifications/sms`, `sms/twilio-client` | **Twilio** |
| `/api/email/welcome`, `/api/member/welcome` | `welcome/send-member-welcome`, `email/resend-client` | **Resend** |
| `/api/member/mailbox` | `member-mailbox` | `member_mailbox_messages` |

---

## External services & wiring

| Service | Env vars | Wired in |
|---------|----------|----------|
| **Supabase** (Auth, DB, Storage) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | `proxy.ts`, `lib/supabase/*`, all API routes, `lib/storage/upload` |
| **Stripe** | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*` | `lib/payments/stripe.ts`, `/api/payments/stripe/*`, `/api/hanger/checkout`, `/api/shop/checkout` |
| **Twilio** (SMS) | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` | `lib/sms/twilio-client.ts`, `lib/notifications/sms.ts`, `/api/sms/send` |
| **Resend** (email) | (via Resend SDK config in client) | `lib/email/resend-client.ts`, `lib/welcome/send-member-welcome.ts` |
| **Anthropic / Claude** | `ANTHROPIC_API_KEY` | `/api/avenue/magazine/generate`, `/api/founder/create/generate`, `/api/founder/marketing-assistant`, Yande cron agents |
| **Whop** (legacy) | `WHOP_API_KEY`, `WHOP_WEBHOOK_SECRET` | `lib/whop.ts`, `/api/whop/*` |
| **Eventbrite** | `EVENTBRITE_API_KEY` | `/api/admin/eventbrite`, `/api/member/eventbrite`, `/api/cron/city-intelligence` |
| **Apify, Yelp, Google Places** | `APIFY_API_KEY`, `YELP_API_KEY`, `GOOGLE_PLACES_API_KEY` | `/api/cron/city-intelligence` (dormant until keys set) |
| **Vercel Cron** | `CRON_SECRET` | `lib/cron-guard.ts` — all `/api/cron/*` |

npm dependencies (direct): `@supabase/ssr`, `@supabase/supabase-js`, `stripe`, `@stripe/stripe-js`, `resend`, `@anthropic-ai/sdk`.

---

## Member portal: client vs server patterns

**Scale (92 member `page.tsx` files):**

| Pattern | Count | Notes |
|---------|-------|-------|
| `"use client"` pages | 44 | Interactive boards, forms, hooks |
| Server pages (no `"use client"`) | 48 | Thin wrappers importing portal components |
| Direct `getAuthUser()` in page | 11 | Server-side auth gate + prop passing |

**Dominant architecture**

1. **Thin server page** — e.g. `member/home/page.tsx` renders `<HomePage />` with no auth fetch in page.
2. **Fat client component** — `app/components/portal/home-page.tsx` (`"use client"`) uses hooks + `fetch('/api/...')`.
3. **Server-gated pages** — clubs `[id]`, settings, passport call `getAuthUser()` then pass user to client boards.
4. **Truth writes** — client stores (`member-calendar-store`, `event-rsvp-store`) call `lib/truth/client.ts` → API → Supabase.
5. **Legacy/local mirrors** — `*-store.ts` modules cache to localStorage when `allowDemoFallback()` or pre-truth; gated by `NEXT_PUBLIC_BLOOMBAY_TRUTHFUL` (default on).

**Data fetching hooks:** `app/hooks/use-home-mockup-data.ts` (client fetch to `/api/clubs`, `/api/home/glance`), `use-live-happenings.ts`.

---

## Prototype / mock data vs real data paths

### Truth mode (real path)

Controlled by `lib/truth/config.ts`:

- `isTruthfulMode()` — `true` unless `NEXT_PUBLIC_BLOOMBAY_TRUTHFUL=0`
- `allowDemoFallback()` — `true` only if `NEXT_PUBLIC_BLOOMBAY_DEMO_FALLBACK=1`

**Real write path:** UI → `lib/truth/client.ts` or direct `fetch('/api/member/*')` → Supabase tables (RLS). See `docs/TRUTH-ROADMAP.md`.

### Mock / prototype locations

| Location | Contents | When used |
|----------|----------|-----------|
| `lib/plans/mock-data.ts` | Plan todos, bloomies list, ticket images, event dates | Plans UI stickers/calendar (alongside `/api/member/plans`) |
| `lib/clubs/mock-data.ts` | Sample club cards | Fallback club discovery |
| `lib/events/mock-data.ts` | Sample events | Legacy event displays |
| `lib/girlmate/mock-data.ts` | GirlMate listings | Prototype GirlMate surfaces |
| `lib/discovery-partners.ts` | Static partner cards | City/partner discovery before CMS fill |
| `lib/the-city-data.ts` | City neighborhood seed | City landing maps |
| `lib/member-*-data.ts` (many root files) | Static page seed content | Scrapbook boards, explore, bulletin |
| `lib/*-store.ts` (27 stores) | localStorage caches | Mirror of truth APIs; demo fallback when allowed |
| `lib/careers-admin.ts` → `SEED_CAREER_APPLICATIONS` | Demo career rows | When `careers_applications` table missing |
| `lib/supabase-admin.ts` waitlist helpers | Demo waitlist rows | Admin dashboard without DB |
| `public/mockup*.html` | Static HTML mockups | Not routed |
| `app/_cursor-member/` | Alternate member UI (57 pages) | Dev sandbox only |

### Real data path summary

```
Member action (reserve, check-in, bloom request, calendar, mood, stamp, witness)
  → lib/truth/client.ts OR /api/member/* OR /api/irl/*
  → lib/supabase/server (session, RLS)
  → PostgreSQL truth tables

Read-heavy feeds (home glance, clubs list, gatherings)
  → Client fetch → /api/home/glance, /api/clubs, /api/member/gatherings
  → Supabase SELECT

Media uploads
  → lib/storage/upload → Supabase Storage buckets (club-media, profile photos)

Cron / admin batch
  → lib/supabase/admin OR lib/supabase-admin (service role, bypass RLS)
```

---

## Risky / notable dependency patterns

### 1. Dual admin Supabase clients

| Module | Export | Used by |
|--------|--------|---------|
| `lib/supabase/admin.ts` | `createAdminClient()` | Most API routes, `lib/notifications/notification-service.ts` |
| `lib/supabase-admin.ts` | `getAdminClient()` | `lib/welcome/send-member-welcome.ts`, `lib/careers-admin` flows, careers API; **falls back to anon key** if service role missing |

**Risk:** Two patterns for service-role access; `supabase-admin.ts` warns and degrades without `SUPABASE_SERVICE_ROLE_KEY`.

### 2. Legacy `lib/supabase.ts` singleton

Bare `@supabase/supabase-js` client export — parallel to `lib/supabase/client.ts` (SSR-aware). Prefer `lib/supabase/*` for new code.

### 3. Store ↔ truth ↔ API triangle

```
lib/truth/client.ts  ← imports types from member-calendar-store
member-calendar-store  ← imports truth/client
event-rsvp-store  ← imports truth/client
discovery-mood-store  ← imports truth/client
```

Not a runtime circular import loop (types + functions are one-directional at runtime), but **tight coupling** between cache stores and truth client.

### 4. Plans UI mock + API blend

`app/components/portal/plans/*` imports heavily from `lib/plans/mock-data.ts` while `/api/member/plans` serves real plan rooms — mixed prototype/production state.

### 5. Root-level `lib/` sprawl

140 modules at `lib/*.ts` vs 148 in subfolders — many `*-store.ts` and `*-data.ts` files overlap conceptually with domain folders (`happenings/`, `clubs/`).

### 6. Component → auth actions from client

`app/components/portal/profile-page.tsx` imports `lib/auth/actions` (server actions) from client component — valid Next pattern but concentrates auth + upload in one client boundary.

### 7. No `@/lib/` imports in most member `page.tsx`

Member pages delegate to `app/components/portal/` which holds the bulk of `lib/` coupling — **grep pages alone understates** member portal dependency on `lib/`.

---

## Auth & security dependency chain

```
proxy.ts
  → @supabase/ssr createServerClient (cookies)
  → role redirect via profiles.role

API routes
  → lib/auth/require-role.ts (requireAuth, requireRole, requireAdmin)
  → lib/auth/get-user.ts
  → lib/admin-auth.ts (legacy admin password routes)

RLS (Supabase)
  → auth.uid() on member tables
  → founder/admin policies (004, 107)
  → cron bypass via service role only
```

See `AUTH_ARCHITECTURE.md`, `SECURITY_ROUTE_MATRIX.md`.

---

## Related docs

| Doc | Focus |
|-----|-------|
| `FILE_TREE.md` | Folder layout & file counts |
| `BLOOMBAY_CODEBASE_MAP.md` | Portal index |
| `API_ARCHITECTURE.md` | Full route listing |
| `DATABASE_ARCHITECTURE.md` | Table domains |
| `COMPONENT_ARCHITECTURE.md` | UI layering |
| `docs/TRUTH-ROADMAP.md` | Mock → truth migration status |
| `docs/PORTALS.md` | Login URLs & role routing |
