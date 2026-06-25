# BloomBay Architecture Review Pack

> Combined architecture reports for pre-beta review. Generated 2026-06-25.
> Source documents remain at repo root; update those files first, then regenerate this pack.

## Table of contents

- [BLOOMBAY_CODEBASE_MAP](#bloombay-codebase-map)
- [DATABASE_ARCHITECTURE](#database-architecture)
- [API_ARCHITECTURE](#api-architecture)
- [COMPONENT_ARCHITECTURE](#component-architecture)
- [AUTH_ARCHITECTURE](#auth-architecture)
- [YANDE_ARCHITECTURE](#yande-architecture)
- [SUPABASE_SCHEMA](#supabase-schema)
- [FILE_TREE](#file-tree)
- [DEPENDENCY_MAP](#dependency-map)

---

<a id="bloombay-codebase-map"></a>

# BLOOMBAY_CODEBASE_MAP

*Source: `BLOOMBAY_CODEBASE_MAP.md`*

## BloomBay Codebase Map

> Branch: `claude/mobile-fixes-screenshots-AV7Xm` · Next.js **16.2.4** · React **19** · Supabase · Vercel

This document orients engineers and AI assistants to the repository layout, portals, and where to change things.

---

## Repository layout

```
girlfrnds-prototype/
├── app/                    # Next.js App Router (pages, API, components)
├── lib/                    # Shared business logic (~285 modules)
├── supabase/               # SQL migrations, apply-all.sql, schema.sql
├── docs/                   # Human guides (SETUP, AUTH, PORTALS, TRUTH-ROADMAP)
├── scripts/                # DB setup, asset pipelines, audits
├── public/                 # Static assets (images, references)
├── proxy.ts                # Edge auth + route protection (Next 16 proxy)
├── next.config.ts
├── vercel.json
└── *.md                    # Architecture docs (this file + siblings)
```

---

## App Router — portals & route groups

| Surface | Path prefix | Route group / folder | Role(s) |
|---------|-------------|----------------------|---------|
| **Member** | `/member/*` | `app/(member-portal)/` | `member` |
| **Founder** | `/founder/*` | `app/founder/(portal)/` | `founder` |
| **Admin / Ops** | `/admin/*` | `app/admin/(ops)/` | `admin`, `moderator` |
| **Curator** | `/curator/*` | `app/curator/(portal)/` | `curator` |
| **Clubhouse** | `/club-owner/*` | `app/club-owner/(authenticated)/` | `club_owner` |
| **Partner** | `/partner/*` | `app/partner/`, `(partner-portal)` | `partner` |
| **GirlMate** | `/girlmate/*` | `app/girlmate/` | GirlMate accounts |
| **Company login** | `/company` | Staff unified login | founder, admin, club_owner, partner, curator |
| **Marketing** | `/`, `/careers`, `/waitlist` | `app/(site)/`, `app/page.tsx` | public |
| **Auth callback** | `/auth/callback` | OAuth / magic link | all |
| **Sandbox** | `/_cursor-member/member/*` | `app/_cursor-member/` | dev mirror (not production nav) |

### Member routes (primary product)

| Area | Example paths |
|------|----------------|
| Home & city | `/member/home`, `/member/city`, `/member/explore` |
| Clubs | `/member/clubs`, `/member/clubs/[id]`, `/member/clubs/create` |
| Happenings | `/member/happenings`, `/member/happenings/[id]` |
| Plans | `/member/plans`, `/member/plan/[id]` |
| Social | `/member/lounge`, `/member/messages`, `/member/notifications` |
| Profile | `/member/settings`, `/member/profile/[username]` |
| Commerce | `/member/hanger`, `/member/drops`, `/member/book` |
| Introductions | `/member/intros`, `/member/match` (may be gated) |
| Avenue | `/member/avenue/*` (magazine, screening room, rooms) |

### Club owner routes (Club Mama / Clubhouse)

~35 pages under `app/club-owner/(authenticated)/`: dashboard, gatherings, branding, members, applications, calendar, scan, finances, zones, etc.

---

## `lib/` — where logic lives

| Folder | Purpose |
|--------|---------|
| `lib/auth/` | Roles, `getAuthUser`, `requireRole`, session, sign-out |
| `lib/supabase/` | Browser/server/admin Supabase clients, middleware helper |
| `lib/truth/` | **Phase 1 truthful writes** — `client.ts`, `behavior.ts`, `config.ts` |
| `lib/yande/` | Yande agent modules (matching, scheduling, safety, cron helpers) |
| `lib/yande-*.ts` | Client memory, signals, recommendations (root-level) |
| `lib/clubs/` | Club types, landing, official clubs, discovery |
| `lib/happenings/` | Gatherings feed, RSVP, posters |
| `lib/payments/` | Stripe checkout, webhooks |
| `lib/notifications/` | In-app + email notification helpers |
| `lib/actions/` | Server actions (hanger, traditions, etc.) |
| `lib/avenue/` | Magazine, screening room, editorial |
| `lib/girlmate/` | GirlMate listings & messaging |

**Rule of thumb:** UI in `app/components/`, data + rules in `lib/`, persistence in `supabase/migrations/`, HTTP in `app/api/`.

---

## `app/components/` — UI organization

| Folder | Used by |
|--------|---------|
| `portal/` | Member portal pages (home, city, happenings, plans, clubs) |
| `member/` | Member-specific widgets (calendar, scrapbook, safety, dossier) |
| `admin/` + `admin/portal/` | Founder Mission Control, Yande center, moderation |
| `founder/` | Founder create-space tooling |
| `club/` | Shared club sidebar / desktop panels |
| `partner/`, `partner-brand/` | Partner portal |
| `curator/` | Curator dashboard |
| `auth/` | `BloomBayLogin`, company portal login |
| `girlmate/` | GirlMate surfaces |
| `events/`, `poster-templates/` | Happening posters & event UI |
| `shared/` | Cross-portal primitives |

Styles live in `app/styles/` (~70 CSS files): `member-portal.css`, `founder-portal.css`, `club-owner-portal.css`, `yande.css`, scrapbook/collage bundles.

---

## Data flow (happy path)

```
Browser → proxy.ts (auth) → Page (RSC/client) → lib/truth/client.ts or lib/* 
       → app/api/* (Route Handler) → Supabase (RLS) → JSON → UI
```

Cron jobs (`app/api/cron/*`) use **service role** Supabase client and bypass RLS.

---

## Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + server session |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin/cron (never expose to client) |
| `NEXT_PUBLIC_BLOOMBAY_TRUTHFUL` | `1` = write to Supabase first (default) |
| `NEXT_PUBLIC_DEV_AUTH_HINTS` | Dev role picker on login |
| `STRIPE_*` | Payments (checkout, webhook) |
| `ANTHROPIC_API_KEY` | Avenue magazine / founder AI tools |
| `RESEND_API_KEY` | Transactional email |

See `.env.example` and `docs/SETUP.md`.

---

## Scripts

| Script | Command |
|--------|---------|
| Dev | `npm run dev` |
| Build | `npm run build` |
| DB bootstrap | `node scripts/db-setup.mjs` |
| Portal link audit | `node scripts/audit-portal-links.mjs` |

---

## Related architecture docs

- `DATABASE_ARCHITECTURE.md` — migration strategy & domains
- `SUPABASE_SCHEMA.md` — table inventory
- `API_ARCHITECTURE.md` — Route Handlers by domain
- `COMPONENT_ARCHITECTURE.md` — UI patterns & portals
- `AUTH_ARCHITECTURE.md` — roles, login, proxy, RLS
- `YANDE_ARCHITECTURE.md` — memory, signals, agents, cron

Also see `docs/TRUTH-ROADMAP.md`, `docs/PORTALS.md`, `SECURITY_ROUTE_MATRIX.md`, `PLANS_ARCHITECTURE.md`.

---

<a id="database-architecture"></a>

# DATABASE_ARCHITECTURE

*Source: `DATABASE_ARCHITECTURE.md`*

## BloomBay Database Architecture

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

---

<a id="api-architecture"></a>

# API_ARCHITECTURE

*Source: `API_ARCHITECTURE.md`*

## BloomBay API Architecture

> **162** Route Handlers under `app/api/**/route.ts` · Next.js App Router · JSON + Supabase

---

## Conventions

| Rule | Detail |
|------|--------|
| Location | `app/api/{domain}/{resource}/route.ts` |
| Auth | `lib/auth/require-role.ts` — `requireAuth()`, `requireRole()`, `requireAdmin()` |
| DB client | `createClient()` from `lib/supabase/server` (session) or `lib/supabase/admin` (service role) |
| Truth writes | Prefer `lib/truth/client.ts` from API routes serving member actions |
| Cron | `app/api/cron/*` — POST only, verify `CRON_SECRET` / Vercel cron header |
| Errors | JSON `{ error: string }` with 4xx/5xx |

---

## API map by domain

### `auth/`
| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/auth/sign-out` | POST | Clear session |

### `irl/` — IRL funnel (Phase 1 truth)
| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/irl/reserve` | POST | Reserve seat → `seat_reservations` |
| `/api/irl/check-in` | POST | Check in → `gathering_attendance` |
| `/api/irl/join-club` | POST | Join club → `club_memberships` |
| `/api/irl/gatherings` | GET | List gatherings |
| `/api/irl/complete-funnel` | POST | Demo / onboarding funnel completion |

### `member/` — Member portal (~55 routes)

**Profile & media**
- `GET/PATCH /api/member/profile` — own profile
- `GET /api/member/profile/[username]` — public profile
- `POST /api/member/profile/bootstrap` — first-time setup
- `GET/POST/DELETE /api/member/profile-photos`
- `PATCH /api/member/profile/notifications`
- `PATCH /api/member/socials`

**Calendar & plans**
- `GET/POST/PATCH/DELETE /api/member/calendar`
- `POST /api/member/calendar/rsvp`, `permanent`, `clubs`
- `GET /api/member/calendar/[id]/ics`
- `GET/POST /api/member/plans`, confirmations

**Happenings & gatherings**
- `GET /api/member/gatherings`, `gatherings/[slug]`
- `GET /api/member/happenings/[id]/room-brief`

**Connect & introductions**
- `GET/POST /api/member/bloom-requests`
- `POST /api/member/bloom-requests/[id]/respond`
- `GET/POST /api/introductions`

**Behavior & Yande**
- `POST /api/member/behavior` — log `member_behavior_signals`
- `GET/POST /api/member/yande-question`
- `POST /api/yande/signal`, `memory`, `context`, `learn`, `support`

**Safety & trust**
- `POST /api/member/witness`, `witnesses`, `GET witness/[id]`
- `POST /api/member/safety-reports`, `safety/verify`
- `GET/POST/DELETE /api/member/block`
- `POST /api/member/report`

**Social & content**
- `GET/POST /api/member/community-posts`
- `GET/POST /api/member/pin-drops`
- `GET/POST /api/member/flowers`, `flowers/[id]`
- `GET/POST /api/member/bouquet`
- `POST /api/member/stamps`
- `GET /api/member/people-you-met`, `my-story`, `bloom-cards`

**Clubs**
- `GET/POST /api/member/club-applications`
- `GET /api/member/desktop-panel`, `home/glance`

**Other**
- `POST /api/member/scan` — QR check-in helper
- `POST /api/member/resolve-code`
- `GET/POST/DELETE /api/member/memories`

### `clubs/`
| Route | Methods |
|-------|---------|
| `/api/clubs` | GET — list clubs |
| `/api/clubs/[slug]` | GET — club detail |
| `/api/clubs/[id]/customization` | GET, POST |
| `/api/clubs/[id]/media` | GET, POST, DELETE |
| `/api/clubs/[id]/membership` | GET |
| `/api/clubs/[id]/patch-order` | GET, POST |
| `/api/clubs/[id]/status` | POST |

### `club-portal/` & `club-owner/`
| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/club-portal/my-club` | GET | Host's club |
| `/api/club-portal/gatherings` | GET, POST | Manage gatherings |
| `/api/club-portal/gatherings/[id]/post-mortem` | GET | Event recap |
| `/api/club-portal/members` | GET | Roster |
| `/api/club-portal/applications` | GET, PATCH | Join requests |
| `/api/club-portal/broadcasts` | GET, POST | Club announcements |
| `/api/club-owner/branding` | GET, PATCH | Brand assets |

### `admin/` & `founder/`
| Route | Purpose |
|-------|---------|
| `/api/admin/stats`, `quick-stats`, `live-stats` | Mission Control KPIs |
| `/api/admin/clubs`, `events` | Ops club/event management |
| `/api/admin/submissions`, `submissions/[id]` | Waitlist / applications |
| `/api/admin/approve-member` | Member approval |
| `/api/admin/verification-photo` | ID review |
| `/api/founder/moderation` | Content moderation queue |
| `/api/founder/message-templates` | SMS/email templates |
| `/api/founder/pitches` | Magazine pitches |
| `/api/founder/marketing-assistant` | AI copy assist |
| `/api/founder/create/generate` | Create-space AI |

### `yande/` & `cron/yande-*`
| Route | Purpose |
|-------|---------|
| `/api/yande/signal` | Ingest `yande_signals` |
| `/api/yande/memory` | Update `yande_user_context` |
| `/api/yande/context` | Read/write member context |
| `/api/yande/learn` | Learning loop weights |
| `/api/yande/support` | Support escalation |
| `/api/cron/yande-host` | Host coaching agent |
| `/api/cron/yande-messages` | Proactive message drafts |
| `/api/cron/yande-community` | Community coordinator |
| `/api/cron/yande-scientist` | Analyst reports |

### Other cron agents
`/api/cron/memory-keeper`, `memory-layer`, `scheduling`, `safety-monitor`, `city-intelligence`, `club-success`, `community-coordinator`, `event-intelligence`, `founder-analyst`, `friendship-health`, `weekly-events`, `wall-seeder`, `avenue-editors`, `post-event`, `operations`

### `avenue/` — Editorial
- `GET /api/avenue/[room]`, `magazine`, `screening-room`, `top-posts`
- `POST /api/avenue/post`, `magazine/generate`, `magazine/pitch`

### `wall/`, `comments/`, `flowers/`
- Wall posts + bloom reactions
- Threaded comments + comment flowers
- `POST /api/flowers`, `comment-flower`

### `girlmate/`
- `GET/POST /api/girlmate`, `messages`, `my-listing`, `partner`

### `hanger/`, `drops/`, `payments/`
- `POST /api/hanger/checkout`
- `GET/POST /api/drops`, `claim`, `redeem`, `verify`
- `POST /api/payments/stripe/checkout`, `webhook`, `refund`
- `POST /api/whop/checkout`, `webhook`

### `reservations/`, `venues/`, `search/`
- Table reservations, venue directory, global search

### `home/`, `careers/`, `feedback/`
- `GET /api/home/glance` — home hero data
- `POST /api/careers/apply`
- `GET/POST/PATCH /api/feedback`

---

## Request flow

```
Client (fetch) 
  → Route Handler (app/api/.../route.ts)
    → requireAuth / requireRole
    → Supabase server client (RLS applies)
    → optional logBehaviorSignal / sendYandeSignal
  → JSON Response
```

**Service role** (bypass RLS): cron routes, some founder admin exports, webhook handlers.

---

## Security notes

- See `SECURITY_ROUTE_MATRIX.md` for route-level auth matrix.
- Webhooks: Stripe/Whop signature verification in route handlers.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client bundles.
- Member APIs must not trust client-sent `user_id` — use `auth.uid()` from session.

---

## Adding a new API

1. Create `app/api/{domain}/{name}/route.ts`
2. Export `GET` / `POST` / `PATCH` / `DELETE` as needed
3. Use `requireRole(['member'])` or appropriate guard
4. Write to Supabase with RLS-friendly inserts
5. If member-facing action: call `logBehaviorSignal()` for Yande
6. Document in this file (or domain README)

---

<a id="component-architecture"></a>

# COMPONENT_ARCHITECTURE

*Source: `COMPONENT_ARCHITECTURE.md`*

## BloomBay Component Architecture

> React 19 · Next.js App Router · Server + Client Components · CSS modules / global CSS in `app/styles/`

---

## Layering model

```
app/(portal)/layout.tsx          ← portal shell (header, sidebar, fonts, CSS imports)
  └── page.tsx                   ← route entry (often thin wrapper)
        └── app/components/...   ← feature UI
              └── lib/...        ← data hooks, types, API clients
```

---

## Portal shells

| Portal | Layout file | Shell component | Nav pattern |
|--------|-------------|-----------------|-------------|
| Member | `app/(member-portal)/layout.tsx` | `MemberPortalShell`, `MemberPortalHeader` | Desktop: icon sidebar · Mobile: hamburger |
| Club owner | `app/club-owner/(authenticated)/layout.tsx` | `club-owner-shell.tsx` | Sidebar + dashboard chrome |
| Founder | `app/founder/(portal)/layout.tsx` | Admin MC shell | Left nav Mission Control |
| Admin | `app/admin/(ops)/layout.tsx` | Ops shell | Admin nav |
| Partner | `app/partner/layout.tsx` | Partner shell | Partner nav |
| GirlMate | `app/girlmate/layout.tsx` | GirlMate chrome | Bottom / top nav |

Member layout imports shared tokens: `bb-scrapbook-tokens.css`, `bb-member-portal-shell.css`, feature CSS per page (home, clubs, happenings, eats).

---

## `app/components/portal/` — member pages

High-level page components wired from `(member-portal)/member/*/page.tsx`:

| Component | Route | Notes |
|-----------|-------|-------|
| `home-page.tsx` | `/member/home` | CSS scrapbook board |
| `clubs-page.tsx` | `/member/clubs` | Clubs discovery |
| City / happenings / plans | `/member/city`, `/member/happenings`, `/member/plans` | Subfolders `portal/city/`, `portal/happenings/`, `portal/plans/` |
| `member-portal-header.tsx` | All member pages | Sticky header + utility icons |
| `member-portal-shell.tsx` | All member pages | Sidebar + main column |
| `portal-utility-icons.tsx` | Header | Pin drops, mailbox, chat, apartment |

**Pattern:** Page files are often async Server Components that call `getAuthUser()` and pass props to client boards.

---

## `app/components/member/` — member widgets

Reusable member UI not tied to a single route:

- `home-css-board.tsx`, `clubs-css-board.tsx` — CSS-only scrapbook layouts
- `home-scrapbook-collage.tsx` — legacy PNG collage (being replaced)
- Calendar, dossier, safety, guidance provider
- `member-guidance-provider.tsx` — onboarding tooltips / coach marks

---

## `app/components/admin/` — founder & ops

- `admin/portal/yande-mission-center.tsx` — Yande ops UI
- KPI panels, verification queue, bloom requests panel
- Used by `/founder/*` and `/admin/*` routes

---

## `app/components/club/` — shared club UI

- Club sidebar, desktop panels
- Used by member club interior and club-owner portal

---

## `app/club-owner/(authenticated)/components/`

Club Mama–specific panels co-located with routes:

- `applications-panel.tsx`, `members-panel.tsx`, `onboarding-checklist.tsx`
- `club-owner-page.tsx` — page wrapper pattern

---

## Client vs server

| Use Server Component | Use Client Component (`"use client"`) |
|---------------------|--------------------------------------|
| `getAuthUser()`, initial data fetch | Interactivity, hooks, browser APIs |
| Static SEO metadata | `useState`, `usePathname`, forms |
| Pass serializable props to children | Supabase realtime (rare) |

**Data fetching on client:** `useEffect` + `fetch('/api/member/...')` or custom hooks in `app/hooks/` (e.g. `use-home-mockup-data.ts`, `use-live-happenings.ts`).

---

## Styling conventions

| Pattern | Location |
|---------|----------|
| Design tokens | `app/styles/bb-scrapbook-tokens.css`, `globals-core.css` |
| Portal bundle | `member-portal.css`, `bb-member-nav.css` |
| Feature CSS | `bb-home-css.css`, `bb-clubs-collage.css`, `bb-happenings-collage.css` |
| BEM-like prefixes | `bb-home-css__`, `bb-member-header__`, `mp-sidebar__` |

Mobile-first; desktop breakpoint often **1024px** for sidebar vs hamburger.

---

## Shared primitives

| Location | Contents |
|----------|----------|
| `app/components/shared/` | Buttons, cards, layout helpers |
| `app/components/portal/bb-logo.tsx` | BloomBay mark |
| `app/components/portal/member-nav-icons.tsx` | SVG nav icons |
| `app/member/components/nav-icons.tsx` | Sidebar icon set |
| `app/components/poster-templates/` | Happening poster frames |

---

## Parallel sandbox: `_cursor-member`

`app/_cursor-member/member/*` mirrors member routes with alternate components. **Do not wire to production nav.** Use for experiments; merge winners into `(member-portal)`.

---

## Component checklist (new feature)

1. Add route under correct `(portal)` group
2. Create page component in `app/components/portal/{feature}/` or `member/`
3. Import styles in portal layout or page
4. Fetch via Server Component or `/api/member/*`
5. Log behavior signals if Yande-relevant
6. Match existing BEM / token naming

See `BLOOMBAY_CODEBASE_MAP.md` for route index.

---

<a id="auth-architecture"></a>

# AUTH_ARCHITECTURE

*Source: `AUTH_ARCHITECTURE.md`*

## BloomBay Auth Architecture

> Supabase Auth · `profiles.role` · Edge proxy · Isolated portals

---

## Roles

Stored on `public.profiles.role` as enum `user_role`:

| Role | Portal | Home after login |
|------|--------|------------------|
| `member` | Member | `/member/home` |
| `founder` | Founder | `/founder/dashboard` |
| `admin` | Admin / Ops | `/admin/dashboard` |
| `moderator` | Admin / Ops | `/admin/dashboard` |
| `curator` | Curator | `/curator/dashboard` |
| `club_owner` | Clubhouse | `/club-owner/dashboard` |
| `partner` | Partner | `/partner` or `/partner/dashboard` |

Source: `supabase/migrations/002_profiles_auth.sql`, `lib/auth/roles.ts`, `lib/auth/get-user.ts`.

**Aliases** normalized in code: `club_mama`, `host`, `clubowner` → `club_owner`.

---

## Login URLs

| Portal | Primary login | Notes |
|--------|---------------|-------|
| Member | `/member/login` | Public member sign-in |
| Staff (founder, admin, club owner, partner, curator) | `/company` | Unified company portal (`COMPANY_LOGIN`) |
| Legacy | `/founder/login`, `/admin/login`, `/club-owner/login`, etc. | Still recognized by `proxy.ts` |

GirlMate: `/girlmate/login`, `/girlmate/signup`

OAuth / magic link callback: `/auth/callback`

---

## Session flow

```
1. User submits credentials at login page (BloomBayLogin / company login)
2. Supabase Auth creates session (cookies via @supabase/ssr)
3. handle_new_user() trigger ensures profiles row exists
4. proxy.ts runs on each request → getUser() → role check vs pathname
5. API routes call requireAuth() / requireRole() independently
```

### Key files

| File | Role |
|------|------|
| `proxy.ts` | Edge protection, legacy redirects, GirlMate gates, onboarding gate |
| `lib/supabase/middleware.ts` | Alternate session helper (cookie role cache) |
| `lib/auth/get-user.ts` | `getAuthUser()` — session + profile join |
| `lib/auth/require-role.ts` | API route guards |
| `lib/auth/actions.ts` | Server actions for login forms |
| `lib/auth/roles.ts` | `PORTAL_ALLOWED`, `homeForRole`, email → role inference |
| `app/auth/callback/route.ts` | OAuth callback handler |

---

## Portal isolation

Each role may only access its portal prefix (`PORTAL_ALLOWED` in `lib/auth/roles.ts`):

- Member on `/founder/*` → redirect to member home or login with error
- Wrong portal sign-in → rejected at login (role mismatch)

`proxy.ts` protected prefixes: `/member`, `/admin`, `/founder`, `/club-owner`, `/partner`, `/curator`, `/portals`

Unauthenticated access → redirect to portal-specific login with `?redirect=` return URL.

---

## Profile creation

`handle_new_user()` (002): on `auth.users` insert → `profiles` row with default `role = 'member'`.

Role changes: SQL update on `profiles` or sign-up metadata (founder tooling only). **107_auth_hardening** prevents users from updating their own `role` via client.

---

## Verification & gates

| Gate | Mechanism |
|------|-----------|
| Email verified | Supabase Auth |
| Member verified (`profiles.verified`) | Founder approval / ID review (Phase 2) |
| Happenings / intros | Middleware or page checks on `verified` |
| Event publish (ID) | `105_event_publishing_id_gate.sql` |

Demo verification UI may exist — replace with real queue per `docs/TRUTH-ROADMAP.md` Phase 2.

---

## RLS (Row Level Security)

Auth ties to Postgres via `auth.uid()`:

```sql
-- Example: own behavior signals
create policy "Behavior signals own"
  on public.member_behavior_signals for select
  using (user_id = auth.uid());
```

Patterns:
- **Own row**: `user_id = auth.uid()` or `id = auth.uid()`
- **Authenticated read**: gatherings, clubs (public catalog)
- **Ops read-all**: founder/admin policies on profiles
- **Service role**: bypasses RLS (cron, webhooks, admin batch)

---

## Dev & test helpers

| Helper | Purpose |
|--------|---------|
| `roleFromEmailAddress()` | `founder@bloombay.app`, `member@bloombay.app`, etc. |
| `mama.{clubslug}@bloombay.app` | Infer club_owner |
| Cookie `bb_dev_role` | Dev-only role override |
| `NEXT_PUBLIC_DEV_AUTH_HINTS=1` | Role picker on login screens |

**Production:** rely on `profiles.role` in database, not email inference alone.

---

## Sign out

- `POST /api/auth/sign-out`
- `lib/auth/member-sign-out.ts` — client helper
- Portal-specific sign-out buttons in sidebar footers

---

## Security hardening (migrations)

| Migration | Hardening |
|-----------|-----------|
| `107_auth_hardening.sql` | Profile update column allowlist |
| `102_profile_privacy.sql` | Restricted profile visibility |
| `103_block_report.sql` | Blocks and reports |
| `105_event_publishing_id_gate.sql` | Gov ID for event publish |

See also `SECURITY_ROUTE_MATRIX.md`.

---

## Adding a new role or portal

1. Extend `user_role` enum in new migration
2. Update `lib/auth/roles.ts` — `USER_ROLES`, `PORTAL_ALLOWED`, `ROLE_HOME`
3. Add login path + `proxy.ts` protected prefix
4. Create `(portal)/layout.tsx` with role check
5. Add RLS policies for role-specific tables
6. Document in `docs/PORTALS.md`

---

<a id="yande-architecture"></a>

# YANDE_ARCHITECTURE

*Source: `YANDE_ARCHITECTURE.md`*

## Yande Architecture

> **Yande is memory + steering, not a chatbot.** Reads real behavior from Supabase and nudges members toward IRL-fit clubs, gatherings, and introductions.

Policy: `YANDE_SMS_POLICY.md` · Roadmap: `docs/TRUTH-ROADMAP.md` Phase 3

---

## Philosophy

| Yande is | Yande is not |
|----------|----------------|
| Rules-first recommendations from attendance & RSVP | Open-ended GPT companion |
| Explainable nudges (“you skip nightlife, you show up to dinners”) | Fake chemistry percentages |
| Background agents (cron) + light UI copy | Always-on chat UI (V1) |
| Fed by `member_behavior_signals` | Fed by marketing personas |

**Example steering** (from TRUTH-ROADMAP):

> You attended 5 dinners · you skip nightlife · you linger at creative gatherings → next nudge: brunch + gallery, not rooftop party.

---

## Data layers

```
Member action (RSVP, check-in, mood, intro request)
        ↓
member_behavior_signals  ← lib/truth/behavior.ts (logBehaviorSignal)
        ↓
Aggregation (rules → lib/yande-memory.ts, lib/yande-member-profile.ts)
        ↓
yande_signals / yande_user_context / memory_events
        ↓
UI nudge OR cron-drafted message OR founder Yande Mission Center
```

### Core tables

| Table | Migration | Purpose |
|-------|-----------|---------|
| `member_behavior_signals` | 006 | Raw event log (`user_id`, `signal_type`, `payload`) |
| `member_preferences` | 064–065 | Explicit prefs (vibe, mood, availability) |
| `yande_signals` | 083 | Structured signals for learning loop |
| `yande_user_context` | 100 | Per-member memory blob / summary |
| `yande_actions` | 059 | Logged agent actions |
| `yande_action_log` | 099 | Audit trail |
| `member_memory_graph` | 062 | Graph edges between memories |
| `memory_events` | 062–063 | Timeline events (triggers auto-write) |
| `yande_messages` | 062 | Draft/sent proactive messages |
| `yande_questions` | 076 | Bloom card / game questions |
| `member_question_responses` | 076 | Answers |
| `yande_match_outcomes` | 083 | Intro match results for learning |
| `yande_compat_weights` | 083 | Learned compatibility weights |
| `yande_match_queue` | 083 | Pending match suggestions |
| `yande_scientist_reports` | 062 | Analyst agent output |
| `yande_memories` | 049 | Long-form memory snippets |

---

## Signal types (behavior log)

From `006_member_truth_layer.sql` and `lib/truth/behavior.ts`:

- `attended_irl`, `rsvp_reserved`, `rsvp_cancelled`
- `mood_set`, `calendar_add`
- `bloom_request_sent`, `bloom_request_accepted`, `bloom_request_declined`
- `witness_submitted`, `club_joined`, `stamp_earned`
- Future: dwell time, decline reasons, brunch vs nightlife splits

---

## Code map

### Client / member-facing

| File | Role |
|------|------|
| `lib/yande-signal.ts` | `sendYandeSignal()`, `useYandeSignal()` hook |
| `lib/yande-memory.ts` | Local + API sync of preference memory |
| `lib/yande-member-state.ts` | Member state for recommendations |
| `lib/yande-member-profile.ts` | Profile context for matching |
| `lib/yande-recommendations.ts` | Rule-based recommendation copy + links |

### Server agents (`lib/yande/`)

| Module | Role |
|--------|------|
| `core.ts` | `logAction()` → `yande_actions` |
| `matching.ts` | Introduction / compat scoring |
| `scheduling.ts` | When to nudge, calendar fit |
| `memory-keeper.ts` | Consolidate `memory_events` |
| `messages.ts` | Draft proactive messages |
| `community-coordinator.ts` | Club/community health |
| `post-event.ts` | After-gathering follow-ups |
| `safety.ts` | Escalation hooks |
| `customer-service.ts` | Support routing |
| `operations.ts` | Ops batch tasks |
| `voice.ts` | Copy tone / templates |

### API routes

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/yande/signal` | POST | Ingest signal |
| `/api/yande/memory` | POST | Update memory |
| `/api/yande/context` | GET, POST | Read/write `yande_user_context` |
| `/api/yande/learn` | POST | Learning loop update |
| `/api/yande/support` | POST | Support escalation |
| `/api/member/behavior` | POST | Member behavior log |
| `/api/member/yande-question` | GET, POST | Bloom card Q&A |

### Cron agents (`/api/cron/`)

| Cron | Agent |
|------|-------|
| `yande-host` | Host coaching |
| `yande-messages` | Message drafts |
| `yande-community` | Community coordinator |
| `yande-scientist` | Analyst reports |
| `memory-keeper` | Memory consolidation |
| `memory-layer` | Graph updates |
| `friendship-health` | Intro health scores |
| `scheduling` | Calendar nudges |

All cron routes: **POST**, service role Supabase, scheduled via Vercel Cron.

### Founder UI

- Page: `/founder/yande`
- Component: `app/components/admin/portal/yande-mission-center.tsx`

---

## Truthful mode

```bash
NEXT_PUBLIC_BLOOMBAY_TRUTHFUL=1   # default — writes go to Supabase first
```

`lib/yande-memory.ts` posts to `/api/yande/memory` when truthful; falls back to localStorage only when API fails (optional `NEXT_PUBLIC_BLOOMBAY_DEMO_FALLBACK=1` for offline dev).

---

## Introductions (Girl Match) integration

V2 introductions should be **Yande-suggested**, not swipe-based:

1. Both members verified + attended ≥1 gathering
2. `yande_match_queue` proposes pairs with **explainable reasons** (shared club, vibe, calendar overlap)
3. `bloom_requests` / `introductions` for mutual opt-in
4. `yande_match_outcomes` feeds `yande_compat_weights` learning loop

Tables: `060_introductions_safety.sql`, `069_come_with_me_bloom_requests.sql`, `083_yande_learning.sql`

---

## Rollout gates (recommended)

| Gate | Threshold |
|------|-----------|
| Show Yande one-liner on home | ≥3 `member_behavior_signals` or 1 attendance |
| Proactive SMS/push | Beta list only (`YANDE_SMS_POLICY.md`) |
| Introductions V2 public | City density + verification Phase 2 complete |
| LLM-generated copy | After rules engine validated on real data |

---

## Hardening

| Migration | Purpose |
|-----------|---------|
| `106_yande_hardening.sql` | Moderation task queue for Yande outputs |
| `097_content_moderation.sql` | Shared moderation pipeline |

---

## Adding a new Yande capability

1. Define `signal_type` in `logBehaviorSignal()` if new member action
2. Emit signal from API route or client via `sendYandeSignal()`
3. Add aggregation rule in `lib/yande-recommendations.ts` or agent module
4. Optional: cron job to batch-process signals
5. Surface copy in member UI (one line, not chat)
6. Log to `yande_actions` for founder visibility

---

<a id="supabase-schema"></a>

# SUPABASE_SCHEMA

*Source: `SUPABASE_SCHEMA.md`*

## BloomBay Supabase Schema Reference

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
## Minimal bootstrap
## Run supabase/apply-all.sql then migrations 003, 006, … in order

## Or full history in Supabase SQL Editor (staging first)
```

See `docs/SETUP.md` and `scripts/db-setup.mjs`.

---

<a id="file-tree"></a>

# FILE_TREE

*Source: `FILE_TREE.md`*

## BloomBay File Tree

> Architecture-focused view of `girlfrnds-prototype` · Next.js **16.2.4** · React **19** · Supabase  
> Excludes `node_modules/`, `.next/`, `.git/`

---

## Repository overview

| Area | Scale |
|------|-------|
| `app/` routes & API | ~92 member pages, 41 club-owner, 35 founder, 19 admin, 162 API handlers |
| `lib/` | **288** TypeScript modules (140 at root, 148 in domain folders) |
| `app/components/` | **450** TS/TSX files |
| `app/styles/` | **81** CSS files |
| `supabase/migrations/` | **122** SQL files |
| `scripts/` | 4 maintenance scripts |

```
girlfrnds-prototype/
├── app/                         # Next.js App Router — pages, layouts, API, UI components
├── lib/                         # Shared business logic, stores, Supabase helpers, Yande
├── supabase/                    # SQL migrations + bootstrap scripts
├── docs/                        # Human guides (9 markdown files)
├── scripts/                     # DB setup, asset pipelines, link audits
├── public/                      # Static images, templates, PWA assets
├── proxy.ts                     # Edge auth + role-based route protection (Next 16)
├── next.config.ts
├── vercel.json                  # Vercel crons (14 scheduled jobs)
├── package.json
└── *.md                         # Architecture docs (see bottom)
```

---

## `app/` — routes & portals

Route groups use parentheses `(name)` — they do not appear in URLs.

### Member portal — `app/(member-portal)/` → `/member/*` (92 pages)

Primary product surface for role `member`.

| Area | Path prefix | Notes |
|------|-------------|-------|
| **Home & hub** | `/member/home`, `/member/lobby`, `/member/you` | Thin `page.tsx` → `app/components/portal/home-page.tsx` |
| **City** | `/member/city/*` | Neighborhoods, places, partners, bloom-notes, moments |
| **Clubs** | `/member/clubs/*` | Discovery, `[id]` interior, create, yande-picks, manage/design/calendar |
| **Happenings** | `/member/happenings/*` | Feed, `[id]`, create, traditions, confetti |
| **Plans** | `/member/plans/*`, `/member/plan/[id]` | Calendar, tickets, confirmations, day view |
| **Lounge & social** | `/member/lounge/*`, `/member/messages`, `/member/chat`, `/member/notifications` | Bloomies, bouquet, memories, founding-chat |
| **Avenue (editorial)** | `/member/avenue/*` | Magazine, wall, eats, fashion, wellness, screening-room, etc. (11 rooms) |
| **Connect & intros** | `/member/connect`, `/member/introductions`, `/member/match`, `/member/bloom-request/*` | Introductions funnel |
| **Commerce** | `/member/hanger`, `/member/drops`, `/member/book`, `/member/partner-drops` | Marketplace & drops |
| **Profile & account** | `/member/profile/*`, `/member/settings`, `/member/passport`, `/member/apartment` | Profile, QR passport, apartment objects |
| **Safety & IRL** | `/member/safety/*`, `/member/scan`, `/member/witness/*` | Check-in, witnessing |
| **Other** | `/member/search`, `/member/host/*`, `/member/girlmate`, `/member/upgrade`, … | Host profiles, GirlMate embed, upgrade |

- **Layout:** `(member-portal)/layout.tsx` — `MemberPortalShell`, scrapbook CSS tokens
- **Login:** `/member/login` (outside route group)

### Club owner (Clubhouse) — `app/club-owner/` → `/club-owner/*` (41 pages)

Role `club_owner`. Authenticated shell at `(authenticated)/`.

| Area | Example paths |
|------|---------------|
| Dashboard & ops | `/club-owner` (dashboard), analytics, timeline, archive |
| Gatherings & events | gatherings, events, events-studio, `[id]`, calendar, scan, attendance |
| Members & apps | members, applications, moderators, volunteers, team(s) |
| Branding & customize | branding, crest, customize, templates, zones, planner, planner-room |
| Finances & payments | finances, payments |
| Comms & safety | ping, alerts, moderation, reports, notifications |
| Settings | settings, rules, resources, portfolio, clubs |

- **Co-located UI:** `(authenticated)/components/` — shell, panels, onboarding checklist (~10 files)
- **Login:** `/club-owner/login`

### Founder (Mission Control) — `app/founder/(portal)/` → `/founder/*` (35 pages)

Role `founder` only. Full ops + create-space tooling.

| Area | Example paths |
|------|---------------|
| Dashboard & KPIs | dashboard, submissions, `[queue]` |
| People & clubs | applications, verification, clubs, clubs/portfolio, events/`[kind]` |
| Content & AI | careers, partners, create-space routes |
| Yande ops | yande center pages (see admin components) |

- **Login:** `/founder/login`

### Admin / Ops — `app/admin/(ops)/` → `/admin/*` (19 pages)

Roles `admin`, `moderator`. Shared login with curator.

| Area | Paths |
|------|-------|
| Dashboard | dashboard, quick-stats panels |
| Queues | submissions, applications, verification, bloom-requests |
| Directory | people, clubs, club-hosts, partners, cities, events |
| Safety & comms | safety, reports, messaging, inbox, girls-working, qa-lab |

- **Login:** `/admin/login`

### Curator — `app/curator/(portal)/` → `/curator/*` (6 pages)

Role `curator`. Uses `/admin/login`; `/curator/login` redirects.

- dashboard, gatherings, pay, women

### Partner — `app/(partner-portal)/partner/` → `/partner/*`

Role `partner`. Venue dashboard, drops, storefront CMS.

- **Login:** `/partner/login`

### GirlMate — `app/girlmate/` → `/girlmate/*`

Separate auth flow (gated in `proxy.ts`). home, post, inbox, partner/dashboard, login, signup.

### Marketing & public — `app/(site)/`, root pages

| Surface | Path | Folder |
|---------|------|--------|
| Landing | `/` | `app/(site)/page.tsx`, `app/page.tsx` |
| Careers | `/careers` | `(site)/careers` |
| Invite | `/invite` | `(site)/invite` |
| Static pages | `/about`, `/waitlist`, `/privacy`, `/terms`, `/safety`, `/venues`, … | `app/{name}/page.tsx` |
| Company login | `/company` | Unified staff login (founder, admin, club_owner, partner, curator) |
| Auth callback | `/auth/callback` | OAuth / magic link |

### Dev sandbox — `app/_cursor-member/` (57 pages)

Mirror of member routes for experiments. **Not wired to production nav.**

---

## `app/api/` — Route Handlers (162 routes)

Grouped by domain prefix:

| Domain | ~Routes | Primary consumers |
|--------|---------|-------------------|
| `member/` | 49 | Member portal client fetches |
| `cron/` | 19 | Vercel scheduled jobs (service role) |
| `admin/` | 14 | Admin/founder Mission Control |
| `clubs/`, `club-portal/`, `club-owner/` | 12 | Member clubs + Clubhouse |
| `founder/` | 8 | Founder portal AI & moderation |
| `avenue/` | 7 | Editorial rooms + magazine AI |
| `yande/` | 5 | Yande signal/memory/context |
| `irl/` | 5 | Phase 1 truth: reserve, check-in, join-club |
| `drops/`, `hanger/`, `payments/`, `whop/`, `shop/` | 12 | Commerce |
| `girlmate/` | 4 | GirlMate listings & messages |
| `wall/`, `comments/`, `flowers/`, `moments/` | 8 | Social content |
| `auth/`, `email/`, `sms/`, `careers/`, `feedback/`, `search/`, `venues/`, `reservations/`, `home/`, `introductions/`, `come-with-me/`, `curator/`, `partner-portal/`, `gatherings/`, `humanize/`, `editor-instructions/`, `waitlist/` | remainder | Cross-portal utilities |

Convention: `app/api/{domain}/{resource}/route.ts` exporting `GET`/`POST`/etc.

---

## `app/components/` — UI (450 files)

| Folder | Used by | Purpose |
|--------|---------|---------|
| `portal/` (~100+) | Member portal | Page-level boards: home, city, happenings, plans, clubs, avenue |
| `portal/city/`, `portal/happenings/`, `portal/plans/`, `portal/clubs/` | Member | Feature subfolders |
| `member/` | Member | Widgets: calendar, scrapbook boards, safety, dossier, guidance |
| `admin/` + `admin/portal/` | Founder & admin | Mission Control, Yande center, moderation queues |
| `founder/` + `founder/create-space/` | Founder | Create-space AI tooling |
| `club/` | Member + club-owner | Shared club sidebar, desktop panels |
| `club-owner/` (in route folder) | Clubhouse | Host-specific panels |
| `partner/`, `partner-brand/`, `partner-templates/` | Partner portal | Venue CMS, branding |
| `curator/` | Curator | Curator dashboard widgets |
| `auth/` | All portals | `BloomBayLogin`, company portal login |
| `girlmate/` | GirlMate | Listings & messaging UI |
| `events/`, `poster-templates/` | Happenings | Poster frames & event UI |
| `shared/` | Cross-portal | Buttons, cards, layout primitives |
| `bloom/`, `bloom-suite/`, `bloom-world/`, `bloom-room/`, `bloom-artifacts/` | Marketing + onboarding | Brand surfaces |

**Styles:** `app/styles/` — 81 CSS files (`member-portal.css`, `founder-portal.css`, `club-owner-portal.css`, scrapbook tokens).

**Hooks:** `app/hooks/` — 3 files (`use-home-mockup-data.ts`, `use-live-happenings.ts`, `use-count-up.ts`).

---

## `lib/` — business logic (288 modules)

### Domain folders

| Folder | Files | Purpose |
|--------|-------|---------|
| `auth/` | 23 | Roles, `getAuthUser`, `requireRole`, session, sign-out, social auth |
| `actions/` | 20 | Server actions: happenings, clubs, hanger, bloom-notes, DMs, traditions |
| `yande/` | 11 | Agent modules: matching, scheduling, safety, messages, operations |
| `clubs/` | 10 | Types, landing, official clubs, discovery, `mock-data.ts` |
| `plans/` | 6 | Plan room types, ticket codes, `mock-data.ts`, `get-plans-data.ts` |
| `founder-create-space/` | 6 | Create-space store + weather helper |
| `truth/` | 5 | Phase 1 truth layer: `client.ts`, `behavior.ts`, `config.ts` |
| `happenings/` | 5 | Gatherings feed, RSVP helpers, posters |
| `supabase/` | 5 | Browser/server/admin clients, middleware helper |
| `partner-brand/` | 5 | Partner storefront store + types |
| `girls-working/` | 4 | Girls Working feature store |
| `message-templates/` | 4 | SMS/email template resolve + render |
| `sms/` | 4 | Twilio client, send-for-user, member reminders |
| `notifications/` | 3 | In-app + email + SMS notification service |
| `payments/` | 3 | Stripe checkout, webhooks |
| `portal-onboarding/` | 3 | Onboarding tour store + types |
| `irl/` | 3 | IRL funnel helpers, founder metrics, member phone |
| `magazine-room/` | 3 | Avenue magazine room store |
| `poster-templates/` | 3 | Happening poster templates |
| `storage/` | 2 | Upload helpers (client + server) |
| `email/` | 2 | Resend client, welcome email |
| `avenue/` | 2 | Magazine, screening room editorial |
| `city/` | 2 | City intelligence helpers |
| `events/` | 2 | Event types + `mock-data.ts` |
| `girlmate/` | 1 | `mock-data.ts` |
| `partner-drops/` | 2 | Partner drops store |
| `welcome/` | 2 | Member welcome flow |
| `images/`, `media/`, `phone/`, `theme/` | 1–3 each | Utilities |

### Root-level modules (~140 files)

Loose modules at `lib/*.ts` — not yet folderized:

| Pattern | Examples | Role |
|---------|----------|------|
| `*-store.ts` (27) | `member-calendar-store`, `club-owner-store`, `home-scrapbook-store` | Client caches; many gate on `isTruthfulMode()` |
| `yande-*.ts` | `yande-memory`, `yande-signal`, `yande-recommendations` | Yande client-side helpers |
| `member-*-data.ts` | `member-portal-data`, `member-connect-data`, `member-explore-data` | Page data loaders / static seed |
| `founder-*` | `founder-dashboard-metrics`, `founder-qa-store`, `mission-control-data` | Founder MC data |
| `club-*` | `club-owner-hub`, `club-discovery`, `club-registry` | Club domain helpers |
| Legacy clients | `supabase.ts`, `supabase-admin.ts` | Older Supabase singletons (see DEPENDENCY_MAP) |

**Rule of thumb:** UI in `app/components/`, data + rules in `lib/`, persistence in `supabase/migrations/`, HTTP in `app/api/`.

---

## `supabase/` — database

```
supabase/
├── apply-all.sql          # Minimal bootstrap: waitlist, profiles, handle_new_user()
├── schema.sql             # Reference snapshot
└── migrations/            # 122 SQL files
    ├── 000_waitlist_table.sql
    ├── 002_profiles_auth.sql
    ├── 003_irl_core.sql           # gatherings, seats, attendance, club_memberships
    ├── 006_member_truth_layer.sql # bloom_requests, calendar, stamps, behavior signals
    ├── 013–021_*                  # clubs, media, storage buckets
    ├── 059–083_*                  # Yande tables, introductions, memory graph
    ├── 107_auth_hardening.sql
    ├── 108_payment_hardening.sql
    ├── 109–114_*                  # indexes, notifications, cron logs
    ├── CATCHUP_missing_tables.sql # Idempotent catch-up bundle
    ├── RUN_ALL_030_to_056.sql     # Batch bundle
    └── PREFLIGHT_drop_triggers.sql
```

**Naming pattern:** `{NNN}_{snake_case_description}.sql` — numeric prefix sets run order. Some prefixes repeat (e.g. two `001_*`, two `003_*`); run in **filename sort order** or follow `docs/SETUP.md`.

**Key domain migrations:** identity (`002`), IRL core (`003`), truth layer (`006`), clubs (`013+`), Yande (`059+`), payments (`108`), RLS hardening (`107`), notifications (`113`).

Full table inventory: `SUPABASE_SCHEMA.md`, domain map: `DATABASE_ARCHITECTURE.md`.

---

## `public/` — static assets

| Folder / file | Purpose |
|---------------|---------|
| `bloom-assets/` | BloomBay scrapbook objects & refs |
| `homepage-objects/`, `homepageobjects/` | Home board collage assets |
| `happenings/` | Poster templates & sample posters |
| `clubs/`, `food templates/`, `profile templates/`, `tickets templates/` | Design templates |
| `assets/bloombay/`, `assets/homepage-processed/` | Processed homepage assets |
| `logo/`, `logosbloombay/`, `icons/`, `images/` | Brand marks |
| `screenshots/`, `references/` | Design references |
| `mockup1.html` – `mockup5.html` | Early HTML mockups (not app routes) |
| `manifest.json`, `sw.js` | PWA shell |

---

## `docs/` — human guides (9 files)

| File | Topic |
|------|-------|
| `SETUP.md` | Local dev + Supabase bootstrap |
| `AUTH.md`, `PORTALS.md` | Login URLs, role routing |
| `TRUTH-ROADMAP.md` | Phase 1 truthful writes vs prototype |
| `BACKEND-PRIORITIES.md` | Engineering priorities |
| `DESIGN-BIBLE.md`, `BEHAVIOR-BIBLE.md`, `WORLD-BIBLE.md` | Product/design context |
| `FOUNDER-REVIEW.md` | Founder review checklist |

---

## `scripts/`

| Script | Purpose |
|--------|---------|
| `db-setup.mjs` | Database bootstrap helper |
| `audit-portal-links.mjs` | Portal link integrity audit |
| `generate-scrapbook-assets.mjs` | Asset generation pipeline |
| `process-homepage-assets.mjs` | Homepage image processing |

---

## Key config files (repo root)

| File | Role |
|------|------|
| `proxy.ts` | Edge middleware: Supabase session, role portal redirects, protected routes |
| `next.config.ts` | Next.js config |
| `vercel.json` | 14 cron schedules + security headers |
| `tsconfig.json` | Path alias `@/` → repo root |
| `.env.example` | Supabase, Stripe, Twilio, Anthropic, cron secret, optional API keys |
| `eslint.config.mjs`, `postcss.config.mjs` | Lint & CSS |

---

## Related architecture docs

- `BLOOMBAY_CODEBASE_MAP.md` — portal index & env vars
- `DATABASE_ARCHITECTURE.md` — migration strategy & table domains
- `API_ARCHITECTURE.md` — full API route listing
- `COMPONENT_ARCHITECTURE.md` — UI layering & client/server patterns
- `AUTH_ARCHITECTURE.md` — roles, proxy, RLS
- `YANDE_ARCHITECTURE.md` — memory, signals, cron agents
- `DEPENDENCY_MAP.md` — cross-module dependency graph (companion doc)

---

<a id="dependency-map"></a>

# DEPENDENCY_MAP

*Source: `DEPENDENCY_MAP.md`*

## BloomBay Dependency Map

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

---
