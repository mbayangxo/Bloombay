# BloomBay Codebase Map

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
