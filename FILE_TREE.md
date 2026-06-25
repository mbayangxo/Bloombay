# BloomBay File Tree

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
